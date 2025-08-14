export default async function handler(req, res) {
  try {
    const response = await fetch("https://fantasy.premierleague.com/api/fixtures/");
    const fixtures = await response.json();

    // Only keep essentials + difficulty score
    const slimmedFixtures = fixtures.map(f => ({
      id: f.id,
      event: f.event,
      kickoff_time: f.kickoff_time,
      team_h: f.team_h,
      team_a: f.team_a,
      team_h_difficulty: f.team_h_difficulty,
      team_a_difficulty: f.team_a_difficulty,
      // Weighted difficulty: home as given, away + 0.5
      home_fixture_score: f.team_h_difficulty,
      away_fixture_score: f.team_a_difficulty + 0.5
    }));

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(slimmedFixtures);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fixtures" });
  }
}
