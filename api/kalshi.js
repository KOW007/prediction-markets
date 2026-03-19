export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  try {
    // Fetch events first, then get markets for each event
    const eventsRes = await fetch('https://api.elections.kalshi.com/trade-api/v2/events?limit=100', {
      headers: { 'Accept': 'application/json' }
    })

    if (!eventsRes.ok) {
      return res.status(eventsRes.status).json({ error: `Kalshi events error: ${eventsRes.status}` })
    }

    const eventsData = await eventsRes.json()
    const events = eventsData.events || []

    // Log first event for debugging
    console.log('First event:', JSON.stringify(events[0]))
    console.log('Total events:', events.length)

    res.status(200).json({ events, markets: [] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
