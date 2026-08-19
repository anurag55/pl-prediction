export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).end()
    return
  }

  const url = new URL(req.url || '/', 'https://pl-prediction.local')
  const rest = decodeURIComponent(url.searchParams.get('path') || '')
  url.searchParams.delete('path')
  const qs = url.searchParams.toString()
  const targetUrl = `https://footballapi.pulselive.com/football/${rest}${qs ? `?${qs}` : ''}`

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Origin: 'https://www.premierleague.com',
        Referer: 'https://www.premierleague.com/',
        account: 'premierleague',
        Accept: 'application/json',
      },
    })
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.status(response.status).json(data)
  } catch {
    res.status(502).json({ error: 'Upstream fetch failed' })
  }
}
