export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    const response = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets?limit=200', {
      headers: { 'Accept': 'application/json' }
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `Kalshi API error: ${response.status}` })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
