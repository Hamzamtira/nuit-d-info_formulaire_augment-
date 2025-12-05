require("dotenv").config();
const app = require("./app");

// Pour Vercel, on exporte l'app directement
// Pour le développement local, on démarre le serveur
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ status: "running" });
});
  });
}

// Export pour Vercel
module.exports = app;
