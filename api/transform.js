export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    const text = data.content?.map(b => b.text || "").join("") || "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "parse" });
    const parsed = JSON.parse(match[0]);
    res.status(200).json(parsed);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}