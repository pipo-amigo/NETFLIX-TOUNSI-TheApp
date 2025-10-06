// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT =  5000;

// Fake ads (replace with real CDN/hosted URLs later)
const ads = [
  "https://fastly.picsum.photos/id/131/800/400.jpg?hmac=p40JwBe5X1V_X4MDNIgPf_kq1xERMy7zJQdN0iNJs3U",
  "https://fastly.picsum.photos/id/911/800/400.jpg?hmac=FZ0xmqtoYN02S2B7pcBq6fkgnaGJbYEvVez_4PLYLzE",
  "https://fastly.picsum.photos/id/911/800/400.jpg?hmac=FZ0xmqtoYN02S2B7pcBq6fkgnaGJbYEvVez_4PLYLzE",
  "https://fastly.picsum.photos/id/911/800/400.jpg?hmac=FZ0xmqtoYN02S2B7pcBq6fkgnaGJbYEvVez_4PLYLzE"
];

// GET /api/ads → return list of ad images
app.get("/api/ads", (req, res) => {
  res.json({ ads });
});

app.listen(PORT, () => {
  console.log(`✅ Ad server running at http://localhost:${PORT}`);
});
