export default async function handler(req, res) {
  const response = await fetch("https://fantasy.premierleague.com/api/fixtures/");
  const data = await response.json();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
