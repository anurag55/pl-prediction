export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.status(405).end()
    return
  }

  const url = new URL(req.url || '/', 'https://pl-prediction.local')
  const rest = decodeURIComponent(url.searchParams.get('path') || '')
  const targetUrl = `https://resources.premierleague.com/premierleague/badges/${rest}`

  try {
    const response = await fetch(targetUrl)
    if (!response.ok) {
      res.status(response.status).end()
      return
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400')
    res.send(buffer)
  } catch {
    res.status(502).end()
  }
}
