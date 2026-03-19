export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const kalshiKey = req.headers['x-kalshi-key']
  if (!kalshiKey) {
    return res.status(400).json({ error: 'Missing Kalshi API key' })
  }

  try {
    const response = await fetch('https://trading-api.kalshi.com/trade-api/v2/markets?status=active&limit=200', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${kalshiKey}`
      }
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
