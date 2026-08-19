import { TEAMS } from '../data/teams'
import type { Team } from '../types'

const API = '/pl-api/football'

type SeasonEntry = { id: number; label: string }
type PulseTeam = {
  id: number
  name: string
  shortName: string
  club: { abbr: string; id: number; name: string; shortName: string }
  grounds?: { name: string; city?: string; capacity?: number }[]
  altIds?: { opta?: string }
}
type StandingEntry = {
  position: number
  team: { id: number; name: string; shortName: string }
  overall: {
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    goalsDifference: number
    points: number
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export async function loadLeagueTeams(): Promise<{ teams: Team[]; live: boolean }> {
  try {
    const seasons = await getJson<{ content: SeasonEntry[] }>(
      `${API}/competitions/1/compseasons?page=0&pageSize=4`,
    )
    const current = seasons.content[0]
    const previous = seasons.content[1]
    if (!current || !previous) throw new Error('Missing season ids')

    const [teamsPayload, standingsPayload] = await Promise.all([
      getJson<{ content: PulseTeam[] }>(
        `${API}/teams?pageSize=100&compSeasons=${current.id}&altIds=true&page=0&comps=1`,
      ),
      getJson<{ tables: { entries: StandingEntry[] }[] }>(
        `${API}/standings?compSeasons=${previous.id}&altIds=true&detail=2&FOOTBALL_COMPETITION=1`,
      ),
    ])

    const lastById = new Map(
      (standingsPayload.tables[0]?.entries ?? []).map((entry) => [entry.team.id, entry]),
    )

    const teams = teamsPayload.content.map((pulse) => {
      const seed = TEAMS.find((team) => team.id === pulse.id)
      const last = lastById.get(pulse.id)
      const ground = pulse.grounds?.[0]

      return {
        ...(seed ?? fallbackTeam(pulse)),
        name: pulse.name,
        shortName: pulse.shortName || pulse.club.shortName,
        abbr: pulse.club.abbr,
        crestCode: pulse.altIds?.opta ?? seed?.crestCode ?? `t${pulse.id}`,
        stadium: ground?.name ?? seed?.stadium ?? '',
        city: ground?.city ?? seed?.city ?? '',
        capacity: ground?.capacity ?? seed?.capacity ?? null,
        lastSeason: last
          ? {
              league: 'Premier League' as const,
              position: last.position,
              played: last.overall.played,
              won: last.overall.won,
              drawn: last.overall.drawn,
              lost: last.overall.lost,
              goalsFor: last.overall.goalsFor,
              goalsAgainst: last.overall.goalsAgainst,
              goalDifference: last.overall.goalsDifference,
              points: last.overall.points,
              note: seed?.lastSeason.note,
            }
          : (seed?.lastSeason ?? {
              league: 'Championship' as const,
              position: 0,
              played: 0,
              won: 0,
              drawn: 0,
              lost: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              goalDifference: 0,
              points: 0,
            }),
      } satisfies Team
    })

    if (teams.length !== 20) throw new Error('Unexpected team count')
    return { teams, live: true }
  } catch {
    return { teams: TEAMS, live: false }
  }
}

function fallbackTeam(pulse: PulseTeam): Team {
  return {
    id: pulse.id,
    name: pulse.name,
    shortName: pulse.shortName,
    abbr: pulse.club.abbr,
    crestCode: pulse.altIds?.opta ?? `t${pulse.id}`,
    stadium: pulse.grounds?.[0]?.name ?? '',
    city: pulse.grounds?.[0]?.city ?? '',
    capacity: pulse.grounds?.[0]?.capacity ?? null,
    founded: 0,
    captain: 'TBD',
    color: '#3d195b',
    manager: {
      name: 'TBC',
      nationality: '',
      appointed: '',
      previousRole: '',
    },
    lastSeason: {
      league: 'Premier League',
      position: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    },
  }
}
