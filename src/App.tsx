import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import { PredictionTable } from './components/PredictionTable'
import { TeamPanel } from './components/TeamPanel'
import { TeamStrip } from './components/TeamStrip'
import { crestUrl, SEASON_LABEL } from './data/teams'
import { usePrediction } from './hooks/usePrediction'
import type { Team } from './types'

function parseDragId(id: string | number) {
  const value = String(id)
  if (value.startsWith('crest-')) return Number(value.slice(6))
  return Number(value)
}

export default function App() {
  const { teams, ranked, order, setOrder, moveTeam, reset, shuffle, live, loading } =
    usePrediction()
  const [selectedId, setSelectedId] = useState<number | null>(ranked[0]?.id ?? 1)
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  const selected = teams.find((team) => team.id === selectedId) ?? ranked[0] ?? null
  const predicted = selected ? order.indexOf(selected.id) + 1 : null

  function onDragStart(event: DragStartEvent) {
    const teamId = parseDragId(event.active.id)
    setActiveTeam(teams.find((team) => team.id === teamId) ?? null)
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTeam(null)
    const { active, over } = event
    if (!over) return
    const activeId = parseDragId(active.id)
    const overId = parseDragId(over.id)
    if (!activeId || !overId || activeId === overId) return

    const fromStrip = String(active.id).startsWith('crest-')
    if (fromStrip) {
      moveTeam(activeId, overId)
      setSelectedId(activeId)
      return
    }

    setOrder((current) => {
      const oldIndex = current.indexOf(activeId)
      const newIndex = current.indexOf(overId)
      if (oldIndex < 0 || newIndex < 0) return current
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">Premier League</p>
          <h1>Predict the table</h1>
        </div>
        <div className="topbar-meta">
          <span className={`source ${live ? 'live' : ''}`}>
            {loading ? 'Loading clubs…' : live ? 'Live clubs from premierleague.com' : 'Club data (offline fallback)'}
          </span>
          <span className="season">{SEASON_LABEL}</span>
        </div>
        <div className="topbar-actions">
          <button type="button" onClick={shuffle}>
            Shuffle
          </button>
          <button type="button" className="ghost" onClick={reset}>
            Last season order
          </button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveTeam(null)}
      >
        <TeamStrip
          teams={teams}
          selectedId={selected?.id ?? null}
          predictedPosition={(id) => order.indexOf(id) + 1}
          onSelect={setSelectedId}
        />

        <main className="workspace">
          <PredictionTable
            ranked={ranked}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
          />
          <TeamPanel team={selected} predicted={predicted} />
        </main>

        <DragOverlay>
          {activeTeam ? (
            <div className="drag-ghost">
              <img src={crestUrl(activeTeam.crestCode, 50)} alt="" width={28} height={28} />
              <span>{activeTeam.shortName}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
