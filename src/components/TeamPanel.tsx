import { crestUrl, LAST_SEASON_LABEL, ordinal } from '../data/teams'
import type { Team } from '../types'

type Props = {
  team: Team | null
  predicted: number | null
}

export function TeamPanel({ team, predicted }: Props) {
  if (!team || predicted === null) {
    return (
      <aside className="team-panel empty">
        <p>Select a club to see the manager, last season, and stadium details.</p>
      </aside>
    )
  }

  const last = team.lastSeason
  const promoted = last.league === 'Championship'
  const delta = promoted ? null : last.position - predicted
  const gd = last.goalDifference > 0 ? `+${last.goalDifference}` : String(last.goalDifference)

  return (
    <aside className="team-panel">
      <div className="panel-banner" style={{ background: team.color }} />
      <div className="panel-head">
        <img
          className="panel-crest"
          src={crestUrl(team.crestCode, 100)}
          alt={`${team.name} crest`}
          width={72}
          height={72}
        />
        <div>
          <p className="panel-kicker">{team.abbr} · est. {team.founded || '—'}</p>
          <h2>{team.name}</h2>
          <p className="panel-sub">{team.city}</p>
        </div>
      </div>

      <dl className="stat-grid">
        <div>
          <dt>Your prediction</dt>
          <dd>{ordinal(predicted)}</dd>
        </div>
        <div>
          <dt>{LAST_SEASON_LABEL}</dt>
          <dd>
            {ordinal(last.position)}
            <small>{last.league === 'Championship' ? 'Champ' : 'PL'}</small>
          </dd>
        </div>
        <div>
          <dt>Movement</dt>
          <dd>
            {delta === null ? 'Promoted' : delta > 0 ? `Up ${delta}` : delta < 0 ? `Down ${Math.abs(delta)}` : 'Same'}
          </dd>
        </div>
      </dl>

      <section className="panel-block">
        <h3>Head coach</h3>
        <p className="coach-name">{team.manager.name}</p>
        <ul className="detail-list">
          <li>
            <span>Nationality</span>
            <strong>{team.manager.nationality || '—'}</strong>
          </li>
          <li>
            <span>Appointed</span>
            <strong>{team.manager.appointed || '—'}</strong>
          </li>
          <li>
            <span>Previous</span>
            <strong>{team.manager.previousRole || '—'}</strong>
          </li>
        </ul>
      </section>

      <section className="panel-block">
        <h3>Last league table</h3>
        <ul className="detail-list">
          <li>
            <span>Competition</span>
            <strong>{last.league}</strong>
          </li>
          <li>
            <span>Finish</span>
            <strong>
              {ordinal(last.position)} · {last.points} pts
            </strong>
          </li>
          <li>
            <span>Record</span>
            <strong>
              {last.won}-{last.drawn}-{last.lost}
            </strong>
          </li>
          <li>
            <span>Goals</span>
            <strong>
              {last.goalsFor}:{last.goalsAgainst} ({gd})
            </strong>
          </li>
        </ul>
        {last.note ? <p className="note">{last.note}</p> : null}
      </section>

      <section className="panel-block">
        <h3>Club</h3>
        <ul className="detail-list">
          <li>
            <span>Stadium</span>
            <strong>{team.stadium}</strong>
          </li>
          <li>
            <span>Capacity</span>
            <strong>{team.capacity ? team.capacity.toLocaleString() : '—'}</strong>
          </li>
          <li>
            <span>Captain</span>
            <strong>{team.captain}</strong>
          </li>
        </ul>
      </section>
    </aside>
  )
}
