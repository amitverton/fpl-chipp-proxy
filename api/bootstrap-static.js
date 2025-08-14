export default async function handler(req, res) {
  try {
    // Always fetch the latest FPL data (disable any caching)
    const response = await fetch(
      'https://fantasy.premierleague.com/api/bootstrap-static/',
      {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`FPL API returned ${response.status}`);
    }

    const data = await response.json();

    // Tell Vercel not to cache this response
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching bootstrap-static:', error);
    res.status(500).json({ error: 'Failed to fetch latest FPL data' });
  }
}
