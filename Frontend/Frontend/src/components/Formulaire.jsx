import React, { useState } from "react";
import MissionFields from "./MissionFields";
import { sendSubmission } from "../services/api.jsx";

export default function Formulaire({ onSubmit }) {
  const [mission, setMission] = useState("");
  const [data, setData] = useState({
    nom: "",
    email: "",
    message: "",
    details: {},
  });

  const handleDetailsChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value,
      },
    }));
  };

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userInput: {
        nom: data.nom,
        email: data.email,
        message: data.message,
        mission: mission,
        details: data.details,
      },
    };

    try {
      const response = await sendSubmission(payload);

      // Préparer les données pour la confirmation
      const confirmationData = {
        nom: data.nom,
        email: data.email,
        mission: mission,
        details: data.details,
        message: data.message,
        response: response.response || response.message || null,
      };

      // Réinitialiser le formulaire
      setMission("");
      setData({
        nom: "",
        email: "",
        message: "",
        details: {},
      });

      // Appeler onSubmit avec les données complètes
      if (onSubmit) {
        onSubmit(confirmationData);
      }
      
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("❌ Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            value={data.nom}
            onChange={(e) => setData({ ...data, nom: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="Votre nom"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mission
          </label>
          <select
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none bg-white text-gray-900"
            required
          >
            <option value="">Choisir une mission...</option>
            <option value="exploration">🔍 Exploration</option>
            <option value="analyse">📊 Analyse</option>
            <option value="secours">🚨 Secours</option>
          </select>
        </div>

        {mission && (
          <MissionFields mission={mission} onChange={handleDetailsChange} />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 placeholder:text-gray-400"
            rows="4"
            placeholder="Votre message..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Envoyer la mission
        </button>
      </form>
    </div>
  );
}
