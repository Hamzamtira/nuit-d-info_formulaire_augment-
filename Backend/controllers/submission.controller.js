// controllers/submission.controller.js
const AIService = require('../services/AIService');

const handleSubmission = async (req, res) => {
  try {
    // Le frontend envoie les données dans userInput
    const userInput = req.body.userInput || req.body;
    const { mission, nom, email, message, details } = userInput;

    if (!mission || !nom || !email) {
      return res.status(400).json({
        ok: false,
        message: 'Mission, nom et email sont requis'
      });
    }

    console.log('Nouvelle soumission:', { mission, nom, email, message, details });

    // Générer les recommandations IA
    let aiRecommendations = null;
    try {
      const prompt = AIService.createMissionPrompt({ nom, email, mission, details, message });
      aiRecommendations = await AIService.generate(prompt);
    } catch (aiError) {
      console.error('Erreur IA:', aiError);
      // Continue sans les recommandations IA
    }

    // Message de base selon la mission
    let responseMessage = '';
    switch (mission) {
      case 'exploration':
        responseMessage = `Mission d'exploration enregistrée avec succès.`;
        break;
      case 'analyse':
        responseMessage = `Demande d'analyse reçue et enregistrée.`;
        break;
      case 'secours':
        responseMessage = `Mission de secours enregistrée avec priorité.`;
        break;
      default:
        responseMessage = 'Votre mission a été enregistrée avec succès.';
    }

    res.status(200).json({
      ok: true,
      message: 'Soumission reçue',
      response: responseMessage,
      aiRecommendations: aiRecommendations, // ← Nouvelles recommandations IA
      data: { nom, email, mission, message, details }
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      ok: false,
      message: 'Erreur serveur'
    });
  }
};

module.exports = { handleSubmission };