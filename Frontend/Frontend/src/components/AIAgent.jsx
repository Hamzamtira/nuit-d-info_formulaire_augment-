import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, Loader2, CheckCircle, AlertCircle, Sparkles, X } from 'lucide-react';
import { askAI } from '../services/api.jsx';

export default function AIAgent({ userInput, onClose }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const messagesEndRef = useRef(null);
  const isGeneratingRef = useRef(false);
  const lastUserInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Vérifier si userInput a vraiment changé
    if (!userInput) return;
    
    const userInputKey = `${userInput.nom}-${userInput.email}-${userInput.mission}-${JSON.stringify(userInput.details)}-${userInput.message}`;
    
    if (userInputKey === lastUserInputRef.current) {
      // Même input, ne pas régénérer
      return;
    }
    
    // Nouvel input détecté - réinitialiser et générer
    setMessages([]);
    setProgress(0);
    setIsTyping(false);
    isGeneratingRef.current = false;
    lastUserInputRef.current = userInputKey;
    
    // Générer la réponse
    generateAIResponse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput]);

  const addMessage = async (text, type, delayBefore = 800) => {
    await new Promise(r => setTimeout(r, delayBefore));
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800));
    setMessages(prev => [...prev, { 
      text, 
      type,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsTyping(false);
  };

  const generateAIResponse = async () => {
    // Éviter les appels multiples simultanés
    if (isGeneratingRef.current) {
      return;
    }
    
    isGeneratingRef.current = true;
    
    try {
      // Step 1: Greeting (20%)
      await addMessage(`Bonjour ${userInput.nom} ! 👋`, 'greeting', 500);
      setProgress(20);

      // Step 2: Confirmation (40%)
      await addMessage(
        `J'ai bien reçu votre demande de mission "${userInput.mission}".`, 
        'info'
      );
      setProgress(40);

      // Step 3: Analysis (60%)
      await addMessage(analyzeInput(userInput), 'analysis');
      setProgress(60);

      // Step 4: AI Recommendations (80%)
      await new Promise(r => setTimeout(r, 800));
      setIsTyping(true);
      
      try {
        const aiPrompt = createMissionPrompt(userInput);
        const aiResponse = await askAI(aiPrompt);
        
        if (aiResponse.success && aiResponse.reply) {
          // Nettoyer la réponse IA (enlever markdown si présent)
          const cleanedReply = cleanAIResponse(aiResponse.reply);
          
          setMessages(prev => [...prev, { 
            text: `💡 Recommandations IA:\n\n${cleanedReply}`, 
            type: 'advice',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          }]);
        } else {
          // Fallback local si l'IA échoue
          setMessages(prev => [...prev, { 
            text: getLocalAdvice(userInput), 
            type: 'advice',
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      } catch (error) {
        console.error("Erreur IA:", error);
        // Fallback vers conseils locaux
        setMessages(prev => [...prev, { 
          text: getLocalAdvice(userInput), 
          type: 'advice',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
      }
      
      setIsTyping(false);
      setProgress(80);

      // Step 5: Final Confirmation (100%)
      await addMessage(
        `✅ Mission enregistrée avec succès!\n\nUn email de confirmation sera envoyé à ${userInput.email}\n\nNotre équipe vous contactera sous 24h pour finaliser les préparatifs.`, 
        'confirmation'
      );
      setProgress(100);

    } catch (error) {
      console.error("Erreur lors de la génération de réponse:", error);
      setIsTyping(false);
    } finally {
      isGeneratingRef.current = false;
    }
  };

  /**
   * Crée un prompt optimisé pour l'IA backend
   */
  const createMissionPrompt = (userInput) => {
    const { nom, email, mission, details, message } = userInput;
    
    let prompt = `Génère 4 recommandations professionnelles numérotées (1. 2. 3. 4.) pour cette mission.\n\n`;
    
    prompt += `DEMANDEUR: ${nom}\n`;
    prompt += `MISSION: ${mission.toUpperCase()}\n\n`;
    
    // Détails spécifiques
    if (mission === "exploration") {
      prompt += `Zone: ${details.zone || "Non spécifiée"}\n`;
      prompt += `Risque: ${details.risque || "Non défini"}\n`;
      if (details.risque === "élevé") {
        prompt += `⚠️ RISQUE ÉLEVÉ - Renforcer sécurité\n`;
      }
    } else if (mission === "analyse") {
      prompt += `Type: ${details.type || "Non spécifié"}\n`;
      prompt += `Urgence: ${details.urgence || "Non définie"}\n`;
      if (details.urgence === "haute") {
        prompt += `⚡ URGENCE HAUTE - Priorité maximale\n`;
      }
    } else if (mission === "secours") {
      prompt += `Victimes: ${details.victimes || "0"}\n`;
      prompt += `Gravité: ${details.gravité || "Non définie"}\n`;
      if (details.gravité === "critique") {
        prompt += `🚨 CRITIQUE - Mobilisation immédiate\n`;
      }
    }
    
    if (message && message.trim()) {
      prompt += `\nMessage: "${message}"\n`;
    }
    
    prompt += `\nFournis exactement 4 recommandations numérotées (1. 2. 3. 4.)\n`;
    prompt += `Format: simple, sans markdown, juste les 4 points.`;
    
    return prompt;
  };

  /**
   * Nettoie la réponse IA des markdowns et formatages indésirables
   */
  const cleanAIResponse = (text) => {
    return text
      .replace(/\*\*/g, '') // Enlève les **
      .replace(/\*/g, '')   // Enlève les *
      .replace(/^#+\s/gm, '') // Enlève les titres markdown
      .replace(/^-\s/gm, '') // Remplace - par numérotation si besoin
      .trim();
  };

  /**
   * Analyse locale des données
   */
  const analyzeInput = ({ mission, details, message }) => {
    let text = `📊 Analyse de votre mission:\n\n`;
    
    switch (mission) {
      case 'exploration':
        text += `• Zone ciblée: ${details.zone || 'Non spécifiée'}\n`;
        text += `• Niveau de risque: ${details.risque || 'Non défini'}`;
        if (details.risque === 'élevé') {
          text += `\n\n⚠️ Attention: Niveau de risque élevé détecté\nPrécautions supplémentaires recommandées`;
        }
        break;
        
      case 'analyse':
        text += `• Type d'analyse: ${details.type || 'Non spécifié'}\n`;
        text += `• Urgence: ${details.urgence || 'Non définie'}`;
        if (details.urgence === 'haute') {
          text += `\n\n⚡ Mission prioritaire\nTraitement en urgence activé`;
        }
        break;
        
      case 'secours':
        text += `• Nombre de victimes: ${details.victimes || '0'}\n`;
        text += `• Niveau de gravité: ${details.gravité || 'Non définie'}`;
        if (details.gravité === 'critique') {
          text += `\n\n🚨 Situation critique détectée\nMobilisation immédiate des ressources`;
        }
        break;
    }
    
    if (message && message.trim()) {
      text += `\n\n💬 Votre message:\n"${message}"`;
    }
    
    return text;
  };

  /**
   * Conseils locaux de secours (si l'IA ne répond pas)
   */
  const getLocalAdvice = ({ mission, details }) => {
    let advice = `💡 Recommandations:\n\n`;
    
    switch (mission) {
      case 'exploration':
        advice += `1. Préparez l'équipement adapté au niveau de risque\n`;
        advice += `2. Établissez un protocole de communication régulier\n`;
        advice += `3. Documentez toutes vos observations\n`;
        if (details.risque === 'élevé') {
          advice += `4. Assurez une équipe de secours en standby`;
        } else {
          advice += `4. Respectez les protocoles de sécurité standards`;
        }
        break;
        
      case 'analyse':
        advice += `1. Rassemblez tous les échantillons nécessaires\n`;
        advice += `2. Suivez les protocoles scientifiques standards\n`;
        advice += `3. Documentez chaque étape du processus\n`;
        if (details.urgence === 'haute') {
          advice += `4. Priorisez les analyses critiques en premier`;
        } else {
          advice += `4. Vérifiez la calibration des instruments`;
        }
        break;
        
      case 'secours':
        advice += `1. Évaluez la situation avant toute intervention\n`;
        advice += `2. Sécurisez le périmètre d'intervention\n`;
        advice += `3. Maintenez une communication constante avec le QG\n`;
        if (details.gravité === 'critique') {
          advice += `4. Demandez des renforts médicaux immédiats`;
        } else {
          advice += `4. Suivez le protocole de triage médical`;
        }
        break;
        
      default:
        advice += `1. Suivez les procédures opérationnelles standards\n`;
        advice += `2. Documentez toutes les étapes\n`;
        advice += `3. Communiquez régulièrement avec votre équipe\n`;
        advice += `4. Priorisez la sécurité à tout moment`;
    }
    
    return advice;
  };

  const msgConfig = {
    greeting: { 
      icon: Sparkles, 
      color: 'from-yellow-50 to-orange-50 border-yellow-200', 
      iconColor: 'text-yellow-500' 
    },
    info: { 
      icon: AlertCircle, 
      color: 'from-blue-50 to-indigo-50 border-blue-200', 
      iconColor: 'text-blue-500' 
    },
    analysis: { 
      icon: Bot, 
      color: 'from-purple-50 to-pink-50 border-purple-200', 
      iconColor: 'text-purple-500' 
    },
    advice: { 
      icon: AlertCircle, 
      color: 'from-orange-50 to-red-50 border-orange-200', 
      iconColor: 'text-orange-500' 
    },
    confirmation: { 
      icon: CheckCircle, 
      color: 'from-green-50 to-emerald-50 border-green-200', 
      iconColor: 'text-green-500' 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Agent IA Nexus</h2>
                <p className="text-sm text-blue-100">Assistant de mission intelligent</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-50 to-blue-50">
          {messages.map((msg, i) => {
            const config = msgConfig[msg.type];
            const Icon = config.icon;
            return (
              <div key={i} className={`bg-gradient-to-br ${config.color} border rounded-xl p-4 animate-slide-up shadow-sm`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-1 flex-shrink-0 ${config.iconColor}`} />
                  <div className="flex-1">
                    <p className="text-gray-800 whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <p className="text-xs text-gray-500 mt-2">{msg.time}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                <div className="flex gap-1">
                  {[0, 150, 300].map((delay, i) => (
                    <span 
                      key={i} 
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                      style={{ animationDelay: `${delay}ms` }} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">L'agent IA analyse...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white rounded-b-2xl">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progression de l'analyse</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}