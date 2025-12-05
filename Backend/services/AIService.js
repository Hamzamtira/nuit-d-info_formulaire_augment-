// Use native fetch (Node 18+) or fallback to node-fetch
let fetch;
try {
  // Try native fetch first (Node 18+)
  if (typeof globalThis.fetch === 'function') {
    fetch = globalThis.fetch;
  } else {
    fetch = require("node-fetch");
  }
} catch (e) {
  // If node-fetch is not available, use native fetch
  fetch = globalThis.fetch;
}

const { baseURL, model } = require("../config/openrouter");

class AIService {
  static async generate(prompt, options = {}) {
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OPENROUTER_API_KEY n'est pas configuré dans les variables d'environnement.");
      }

      // System message pour définir le contexte et le rôle de l'IA
      const systemMessage = {
        role: "system",
        content: `Tu es un assistant IA expert pour "Nexus Connecté", une plateforme avancée de gestion de missions spatiales.

IDENTITÉ ET RÔLE:
Tu es un conseiller expert en opérations spatiales avec une expertise approfondie dans:
- Planification et exécution de missions spatiales
- Gestion des risques et protocoles de sécurité
- Coordination d'équipes et ressources
- Analyse de situations critiques et recommandations stratégiques

TYPES DE MISSIONS:

1. EXPLORATION (exploration):
   Objectif: Découverte, cartographie et analyse de zones spatiales inconnues
   Facteurs critiques:
   - Zone ciblée: Détermine l'équipement et les ressources nécessaires
   - Niveau de risque (faible/modéré/élevé): Impacte directement les protocoles de sécurité
   Recommandations typiques: Équipement adapté, protocoles de communication, documentation, équipes de secours

2. ANALYSE (analyse):
   Objectif: Missions scientifiques, évaluation de données, structures ou phénomènes
   Facteurs critiques:
   - Type d'analyse: Détermine les méthodologies et instruments requis
   - Niveau d'urgence (basse/haute): Priorise les ressources et délais
   Recommandations typiques: Protocoles scientifiques, calibration instruments, documentation, priorités

3. SECOURS (secours):
   Objectif: Missions d'urgence, sauvetage et assistance médicale
   Facteurs critiques:
   - Nombre de victimes: Détermine l'ampleur de la réponse
   - Gravité (mineure/critique): Impacte l'urgence et les ressources médicales
   Recommandations typiques: Évaluation situation, sécurisation zone, communication QG, ressources médicales

INSTRUCTIONS IMPORTANTES:
1. PERSONNALISATION: Utilise TOUTES les informations fournies (nom, email, mission, détails spécifiques, message)
2. CONTEXTE: Adapte tes recommandations au contexte spécifique mentionné dans le message du demandeur
3. ALERTES: Si risque élevé, urgence haute ou gravité critique → Recommandations renforcées et prioritaires
4. PRATIQUE: Chaque recommandation doit être concrète, actionnable et directement applicable
5. SÉCURITÉ: Toujours prioriser la sécurité et les protocoles appropriés

FORMAT DE RÉPONSE:
- Exactement 4 recommandations numérotées (1. 2. 3. 4.)
- Format simple, sans markdown (pas de #, *, **, etc.)
- Chaque recommandation sur une ligne séparée
- Style professionnel mais accessible
- Toujours en français
- Adapté au type de mission et aux détails fournis
- Utilise les informations du message pour personnaliser si pertinent

EXEMPLE DE FORMAT:
1. Première recommandation concrète et actionnable
2. Deuxième recommandation adaptée au contexte
3. Troisième recommandation avec considérations de sécurité
4. Quatrième recommandation personnalisée selon les détails`
      };

      // Message utilisateur avec le prompt fourni
      const userMessage = {
        role: "user",
        content: prompt
      };

      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "Nexus Connecté"
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, userMessage],
          temperature: options.temperature || 0.6, // Légèrement plus bas pour des réponses plus cohérentes
          max_tokens: options.max_tokens || 400, // Plus de tokens pour des recommandations détaillées
          top_p: 0.9, // Contrôle la diversité des réponses
          frequency_penalty: 0.2, // Évite les répétitions
          presence_penalty: 0.1 // Encourage la variété
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API OpenRouter (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Réponse IA invalide.");
      }

      return data.choices[0].message.content;

    } catch (error) {
      console.error("AIService Error:", error);
      throw new Error(`Impossible d'obtenir une réponse IA: ${error.message}`);
    }
  }

  /**
   * Génère un prompt optimisé pour les recommandations de mission
   * @param {Object} missionData - Données de la mission
   * @param {string} missionData.nom - Nom de l'utilisateur
   * @param {string} missionData.email - Email de l'utilisateur
   * @param {string} missionData.mission - Type de mission (exploration, analyse, secours)
   * @param {Object} missionData.details - Détails spécifiques de la mission
   * @param {string} missionData.message - Message additionnel de l'utilisateur
   * @returns {string} Prompt optimisé
   */
  static createMissionPrompt(missionData) {
    const { nom = "", email = "", mission, details = {}, message = "" } = missionData;
    
    let prompt = `Génère exactement 4 recommandations professionnelles numérotées (1. 2. 3. 4.) pour cette mission spatiale.\n\n`;
    
    // Informations du demandeur
    prompt += `DEMANDEUR:\n`;
    if (nom) {
      prompt += `Nom: ${nom}\n`;
    }
    if (email) {
      prompt += `Contact: ${email}\n`;
    }
    
    // Type de mission
    prompt += `\nTYPE DE MISSION: ${mission.toUpperCase()}\n`;
    
    // Détails spécifiques selon le type de mission avec alertes
    if (mission === "exploration") {
      prompt += `\nDÉTAILS EXPLORATION:\n`;
      prompt += `Zone ciblée: ${details.zone || "Non spécifiée"}\n`;
      prompt += `Niveau de risque: ${details.risque || "Non défini"}\n`;
      if (details.risque === "élevé") {
        prompt += `\n⚠️ ALERTE SÉCURITÉ: RISQUE ÉLEVÉ DÉTECTÉ\n`;
        prompt += `→ Recommandations de sécurité renforcées obligatoires\n`;
        prompt += `→ Équipe de secours en standby requise\n`;
        prompt += `→ Protocoles d'urgence activés\n`;
      }
    } else if (mission === "analyse") {
      prompt += `\nDÉTAILS ANALYSE:\n`;
      prompt += `Type d'analyse: ${details.type || "Non spécifié"}\n`;
      prompt += `Niveau d'urgence: ${details.urgence || "Non défini"}\n`;
      if (details.urgence === "haute") {
        prompt += `\n⚡ ALERTE URGENCE: TRAITEMENT PRIORITAIRE\n`;
        prompt += `→ Allocation immédiate des ressources\n`;
        prompt += `→ Protocoles accélérés activés\n`;
        prompt += `→ Communication directe avec équipe scientifique\n`;
      }
    } else if (mission === "secours") {
      prompt += `\nDÉTAILS SECOURS:\n`;
      prompt += `Nombre de victimes: ${details.victimes || "0"}\n`;
      prompt += `Niveau de gravité: ${details.gravité || "Non définie"}\n`;
      if (details.gravité === "critique") {
        prompt += `\n🚨 ALERTE CRITIQUE: MOBILISATION IMMÉDIATE\n`;
        prompt += `→ Équipe médicale d'urgence déployée\n`;
        prompt += `→ Ressources de secours prioritaires\n`;
        prompt += `→ Coordination QG en temps réel\n`;
      }
    }
    
    // Tous les détails supplémentaires
    if (details && Object.keys(details).length > 0) {
      const detailKeys = Object.keys(details);
      const standardKeys = mission === "exploration" ? ["zone", "risque"] : 
                         mission === "analyse" ? ["type", "urgence"] : 
                         mission === "secours" ? ["victimes", "gravité"] : [];
      
      const additionalDetails = detailKeys.filter(key => !standardKeys.includes(key) && details[key]);
      if (additionalDetails.length > 0) {
        prompt += `\nINFORMATIONS SUPPLÉMENTAIRES:\n`;
        additionalDetails.forEach(key => {
          prompt += `${key}: ${details[key]}\n`;
        });
      }
    }
    
    // Message du demandeur - très important pour personnalisation
    if (message && message.trim()) {
      prompt += `\nMESSAGE DU DEMANDEUR (À UTILISER POUR PERSONNALISER):\n"${message}"\n`;
      prompt += `\n→ Analyse ce message attentivement et adapte tes recommandations en fonction des besoins spécifiques exprimés.\n`;
    }
    
    // Instructions finales
    prompt += `\nINSTRUCTIONS:\n`;
    prompt += `- Génère exactement 4 recommandations numérotées (1. 2. 3. 4.)\n`;
    prompt += `- Chaque recommandation doit être concrète, actionnable et spécifique à cette mission\n`;
    prompt += `- Utilise TOUTES les informations fournies (nom, email, mission, détails, message)\n`;
    prompt += `- Adapte les recommandations au contexte exprimé dans le message du demandeur\n`;
    prompt += `- Si des alertes sont présentes (risque élevé, urgence haute, gravité critique), les recommandations doivent refléter cette urgence\n`;
    prompt += `- Format simple, sans markdown, juste les 4 points numérotés\n`;
    prompt += `- Style professionnel mais amissioncessible, en français\n`;
    
    return prompt;
  }
}

module.exports = AIService;
