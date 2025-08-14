export default async function handler(req, res) {
  try {
    const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    const data = await response.json();

    // Only keep essential player fields
    const slimmedPlayers = data.elements.map(player => ({
      id: player.id,
      web_name: player.web_name,
      team: player.team,
      element_type: player.element_type,
      now_cost: player.now_cost / 10, // convert to millions
      total_points: player.total_points,
      form: player.form,
      minutes: player.minutes,
      status: player.status,
      news: player.news,
      selected_by_percent: player.selected_by_percent
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(slimmedPlayers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player data" });
  }
}
