import { useEffect, useMemo, useState } from 'react'
import { loadLeagueTeams } from '../api/premierLeague'
import { DEFAULT_ORDER, lastSeasonOrder, STORAGE_KEY, TEAMS } from '../data/teams'
import type { Team } from '../types'

function readSavedOrder(validIds: number[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as number[]
    if (
      parsed.length === validIds.length &&
      validIds.every((id) => parsed.includes(id))
    ) {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

export function usePrediction() {
  const [teams, setTeams] = useState<Team[]>(TEAMS)
  const [order, setOrder] = useState<number[]>(() => readSavedOrder(DEFAULT_ORDER) ?? DEFAULT_ORDER)
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    loadLeagueTeams().then(({ teams: nextTeams, live: isLive }) => {
      if (cancelled) return
      setTeams(nextTeams)
      setLive(isLive)
      setOrder((current) => {
        const ids = nextTeams.map((team) => team.id)
        const saved = readSavedOrder(ids)
        if (saved) return saved
        const stillValid =
          current.length === ids.length && ids.every((id) => current.includes(id))
        return stillValid ? current : lastSeasonOrder(nextTeams)
      })
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (loading) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order))
  }, [order, loading])

  const ranked = useMemo(
    () =>
      order
        .map((id) => teams.find((team) => team.id === id))
        .filter((team): team is Team => Boolean(team)),
    [order, teams],
  )

  function reset() {
    setOrder(lastSeasonOrder(teams))
  }

  function shuffle() {
    const next = [...order]
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    setOrder(next)
  }

  function moveTeam(activeId: number, overId: number) {
    if (activeId === overId) return
    setOrder((current) => {
      const from = current.indexOf(activeId)
      const to = current.indexOf(overId)
      if (from < 0 || to < 0) return current
      const next = [...current]
      next.splice(from, 1)
      next.splice(to, 0, activeId)
      return next
    })
  }

  return { teams, ranked, order, setOrder, moveTeam, reset, shuffle, live, loading }
}
