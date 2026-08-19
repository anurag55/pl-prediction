export type LeagueName = 'Premier League' | 'Championship'

export type LastSeason = {
  league: LeagueName
  position: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  note?: string
}

export type Manager = {
  name: string
  nationality: string
  appointed: string
  previousRole: string
}

export type Team = {
  id: number
  name: string
  shortName: string
  abbr: string
  crestCode: string
  stadium: string
  city: string
  capacity: number | null
  founded: number
  captain: string
  color: string
  manager: Manager
  lastSeason: LastSeason
}

export type QualificationBand = 'ucl' | 'uel' | 'uecl' | 'mid' | 'rel'
