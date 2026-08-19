import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { crestUrl } from '../data/teams'
import type { Team } from '../types'

type Props = {
  teams: Team[]
  selectedId: number | null
  predictedPosition: (id: number) => number
  onSelect: (id: number) => void
}

function CrestChip({
  team,
  selected,
  position,
  onSelect,
}: {
  team: Team
  selected: boolean
  position: number
  onSelect: (id: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `crest-${team.id}`,
    data: { teamId: team.id, from: 'strip' },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`crest-chip ${selected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''}`}
      style={{ transform: transform ? CSS.Translate.toString(transform) : undefined }}
      onClick={() => onSelect(team.id)}
      aria-label={`${team.name}, predicted ${position}`}
      title={`${team.name} · predicted ${position}`}
      {...listeners}
      {...attributes}
    >
      <img src={crestUrl(team.crestCode, 70)} alt={team.name} width={40} height={40} />
      <span className="chip-pos">{position}</span>
    </button>
  )
}

export function TeamStrip({ teams, selectedId, predictedPosition, onSelect }: Props) {
  const sorted = [...teams].sort((a, b) => a.shortName.localeCompare(b.shortName))

  return (
    <section className="team-strip" aria-label="All Premier League clubs">
      <div className="strip-copy">
        <p>All 20 clubs</p>
        <span>Click for details · drag a crest onto a row to place it</span>
      </div>
      <div className="strip-track">
        {sorted.map((team) => (
          <CrestChip
            key={team.id}
            team={team}
            selected={selectedId === team.id}
            position={predictedPosition(team.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
