const AIService = require("../services/AIService");

exports.askAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Champ 'message' manquant." });
    }

    const reply = await AIService.generate(message);

    res.json({
      success: true,
      reply
    });

  } catch (err) {
    next(err);
  }
};
