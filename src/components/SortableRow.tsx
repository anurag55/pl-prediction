import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { crestUrl, ordinal, qualificationBand } from '../data/teams'
import type { Team } from '../types'

type Props = {
  team: Team
  position: number
  selected: boolean
  onSelect: (id: number) => void
}

export function SortableRow({ team, position, selected, onSelect }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: team.id })
  const band = qualificationBand(position)
  const last = team.lastSeason
  const promoted = last.league === 'Championship'
  const delta = promoted ? null : last.position - position

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`table-row band-${band} ${selected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => onSelect(team.id)}
    >
      <td className="col-handle">
        <button className="drag-handle" aria-label={`Reorder ${team.name}`} {...attributes} {...listeners}>
          <span />
          <span />
          <span />
        </button>
      </td>
      <td className="col-pos">
        <span className="pos-num">{position}</span>
      </td>
      <td className="col-club">
        <img src={crestUrl(team.crestCode, 50)} alt="" width={28} height={28} />
        <div>
          <strong>{team.shortName}</strong>
          <span className="club-meta">{team.abbr}</span>
        </div>
      </td>
      <td className="col-last">
        {promoted ? (
          <span className="pill promo">P · {ordinal(last.position)}</span>
        ) : (
          ordinal(last.position)
        )}
      </td>
      <td className="col-move">
        {delta === null ? (
          <span className="delta new">NEW</span>
        ) : delta > 0 ? (
          <span className="delta up">▲ {delta}</span>
        ) : delta < 0 ? (
          <span className="delta down">▼ {Math.abs(delta)}</span>
        ) : (
          <span className="delta flat">–</span>
        )}
      </td>
    </tr>
  )
}
