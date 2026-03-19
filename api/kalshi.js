export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    let allMarkets = []
    let cursor = ''

    // Fetch up to 5 pages (1000 markets) looking for priced markets
    for (let i = 0; i < 5; i++) {
      const url = `https://api.elections.kalshi.com/trade-api/v2/markets?limit=200${cursor ? `&cursor=${cursor}` : ''}`
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } })

      if (!response.ok) {
        return res.status(response.status).json({ error: `Kalshi API error: ${response.status}` })
      }

      const data = await response.json()
      const markets = data.markets || []

      // Skip parlay/multi-variable markets — they have no individual pricing
      const single = markets.filter(m => !m.mve_collection_ticker)
      allMarkets = allMarkets.concat(single)

      cursor = data.cursor || ''
      if (!cursor) break

      // Stop early if we have enough priced markets
      const priced = allMarkets.filter(m => parseFloat(m.yes_ask_dollars || '0') > 0)
      if (priced.length >= 50) break
    }

    res.status(200).json({ markets: allMarkets })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
