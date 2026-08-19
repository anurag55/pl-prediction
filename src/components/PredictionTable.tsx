import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { qualificationBand } from '../data/teams'
import type { Team } from '../types'
import { SortableRow } from './SortableRow'

type Props = {
  ranked: Team[]
  selectedId: number | null
  onSelect: (id: number) => void
}

export function PredictionTable({ ranked, selectedId, onSelect }: Props) {
  return (
    <div className="table-wrap">
      <SortableContext items={ranked.map((team) => team.id)} strategy={verticalListSortingStrategy}>
        <table className="pred-table">
          <thead>
            <tr>
              <th className="col-handle" />
              <th className="col-pos">#</th>
              <th className="col-club">Club</th>
              <th className="col-last">Last</th>
              <th className="col-move">+/-</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((team, index) => (
              <SortableRow
                key={team.id}
                team={team}
                position={index + 1}
                selected={selectedId === team.id}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
      <ul className="legend">
        <li className={`band-${qualificationBand(1)}`}>1–4 Champions League</li>
        <li className={`band-${qualificationBand(5)}`}>5 Europa League</li>
        <li className={`band-${qualificationBand(6)}`}>6 Conference League</li>
        <li className={`band-${qualificationBand(18)}`}>18–20 Relegation</li>
      </ul>
    </div>
  )
}
