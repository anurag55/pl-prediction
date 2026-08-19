import { qualificationBand, SEASON_LABEL, shareCrestUrl } from '../data/teams'
import type { Team } from '../types'

type Props = {
  ranked: Team[]
}

function Row({ team, position }: { team: Team; position: number }) {
  return (
    <div className={`share-row band-${qualificationBand(position)}`}>
      <span className="share-pos">{position}</span>
      <img src={shareCrestUrl(team.crestCode, 50)} alt="" width={28} height={28} />
      <span className="share-name">{team.shortName}</span>
      <span className="share-abbr">{team.abbr}</span>
    </div>
  )
}

export function ShareCard({ ranked }: Props) {
  const left = ranked.slice(0, 10)
  const right = ranked.slice(10)

  return (
    <>
      <header className="share-head">
        <p>Premier League</p>
        <h2>My predicted table</h2>
        <span>{SEASON_LABEL}</span>
      </header>
      <div className="share-grid">
        <div>
          {left.map((team, index) => (
            <Row key={team.id} team={team} position={index + 1} />
          ))}
        </div>
        <div>
          {right.map((team, index) => (
            <Row key={team.id} team={team} position={index + 11} />
          ))}
        </div>
      </div>
      <ul className="share-legend">
        <li className="band-ucl">1–4 UCL</li>
        <li className="band-uel">5 UEL</li>
        <li className="band-uecl">6 UECL</li>
        <li className="band-rel">18–20 Rel</li>
      </ul>
    </>
  )
}
