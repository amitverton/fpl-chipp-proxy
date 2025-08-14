export default async function handler(req, res) {
  try {
    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });

    if (!response.ok) throw new Error(`FPL API returned ${response.status}`);
    const data = await response.json();

    // Accurate list of 2025/26 EPL teams
    const validTeams = [
      'Arsenal',
      'Aston Villa',
      'Bournemouth',
      'Brentford',
      'Brighton & Hove Albion',
      'Burnley',
      'Chelsea',
      'Crystal Palace',
      'Everton',
      'Fulham',
      'Ipswich Town',
      'Leicester City',
      'Liverpool',
      'Manchester City',
      'Manchester United',
      'Newcastle United',
      'Nottingham Forest',
      'Tottenham Hotspur',
      'West Ham United',
      'Wolverhampton Wanderers'
    ];

    // Map valid team IDs
    const validTeamIds = data.teams
      .filter(team => validTeams.includes(team.name))
      .map(team => team.id);

    // Manual transfer corrections (player ID → new team ID)
    // You can add more here if FPL hasn't updated yet
    const transferCorrections = {
      // Example: Kudus to Tottenham
      // Find Tottenham's team ID dynamically from data.teams
      1234: data.teams.find(t => t.name === 'Tottenham Hotspur')?.id // Replace 1234 with Kudus' actual player.id
    };

    // Slimmed-down, corrected player list
    const slimmedPlayers = data.elements
      // Keep only players in valid EPL teams OR corrected transfers
      .filter(player => validTeamIds.includes(player.team) || transferCorrections[player.id])
      // Apply transfer corrections
      .map(player => {
        if (transferCorrections[player.id]) {
          return { ...player, team: transferCorrections[player.id] };
        }
        return player;
      })
      // Return only essential fields
      .map(player => ({
        id: player.id,
        first_name: player.first_name,
        second_name: player.second_name,
        web_name: player.web_name,
        team_id: player.team,
        team_name: data.teams.find(t => t.id === player.team)?.name || 'Unknown',
        position: ['GKP', 'DEF', 'MID', 'FWD'][player.element_type - 1],
        price: player.now_cost / 10,
        total_points: player.total_points,
        form: player.form,
        minutes: player.minutes,
        status: player.status, // a=available, i=injured, s=suspended, d=doubtful
        news: player.news,
        selected_by_percent: player.selected_by_percent
      }));

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).json(slimmedPlayers);

  } catch (error) {
    console.error('Error fetching bootstrap-slim:', error);
    res.status(500).json({ error: 'Failed to fetch latest FPL data' });
  }
}
