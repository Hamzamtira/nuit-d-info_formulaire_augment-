const express = require("express");
const cors = require("cors");

// Import des routes
const submissionRoutes = require("./routes/submission.routes");
const aiRoutes = require("./routes/ai.routes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Routes disponibles
app.use("/api/submission", submissionRoutes);  // 🔥 Manquait !
app.use("/api/ai", aiRoutes);

// Gestion globale des erreurs
app.use(errorHandler);

module.exports = app;
