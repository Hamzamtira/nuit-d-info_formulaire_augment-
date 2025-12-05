import React from "react";

export default function MissionFields({ mission, onChange }) {
  switch (mission) {
    case "exploration":
      return (
        <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 animate-fade-in">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Détails de l'Exploration
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zone à explorer
            </label>
            <input 
              type="text" 
              onChange={(e) => onChange("zone", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="Ex: Secteur Alpha-7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de risque
            </label>
            <select 
              onChange={(e) => onChange("risque", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white text-gray-900"
            >
              <option value="">Choisir…</option>
              <option value="faible">🟢 Faible</option>
              <option value="modéré">🟡 Modéré</option>
              <option value="élevé">🔴 Élevé</option>
            </select>
          </div>
        </div>
      );

    case "analyse":
      return (
        <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 animate-fade-in">
          <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            Détails de l'Analyse
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'analyse
            </label>
            <input 
              type="text" 
              onChange={(e) => onChange("type", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="Ex: Analyse structurelle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgence
            </label>
            <select 
              onChange={(e) => onChange("urgence", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none bg-white text-gray-900"
            >
              <option value="">Choisir…</option>
              <option value="basse">⏱️ Basse</option>
              <option value="haute">⚡ Haute</option>
            </select>
          </div>
        </div>
      );

    case "secours":
      return (
        <div className="space-y-4 p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 animate-fade-in">
          <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Détails du Secours
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de victimes
            </label>
            <input 
              type="number" 
              onChange={(e) => onChange("victimes", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gravité
            </label>
            <select 
              onChange={(e) => onChange("gravité", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none bg-white text-gray-900"
            >
              <option value="">Choisir…</option>
              <option value="mineure">⚠️ Mineure</option>
              <option value="critique">🚨 Critique</option>
            </select>
          </div>
        </div>
      );

    default:
      return null;
  }
}