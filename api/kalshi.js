export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    // Step 1: Fetch events
    const eventsRes = await fetch('https://api.elections.kalshi.com/trade-api/v2/events?limit=100', {
      headers: { 'Accept': 'application/json' }
    })
    if (!eventsRes.ok) {
      return res.status(eventsRes.status).json({ error: `Kalshi events error: ${eventsRes.status}` })
    }
    const eventsData = await eventsRes.json()
    const events = eventsData.events || []

    // Step 2: Fetch markets for each event in parallel (first 30 events)
    const marketRequests = events.map(event =>
      fetch(`https://api.elections.kalshi.com/trade-api/v2/markets?event_ticker=${event.event_ticker}&limit=10`, {
        headers: { 'Accept': 'application/json' }
      }).then(r => r.json()).then(d => d.markets || []).catch(() => [])
    )

    const marketArrays = await Promise.all(marketRequests)
    const allMarkets = marketArrays.flat()

    res.status(200).json({ markets: allMarkets })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
