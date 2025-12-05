import React, { useState } from "react";
import { CheckCircle, AlertCircle, Bot } from 'lucide-react';
import AIAgent from './AIAgent';

export default function Confirmation({ data }) {
  const [showAIAgent, setShowAIAgent] = useState(true);

  return (
    <>
      {showAIAgent && (
        <AIAgent 
          userInput={{
            nom: data.nom,
            email: data.email,
            mission: data.mission,
            details: data.details,
            message: data.message || ""
          }}
          onClose={() => setShowAIAgent(false)}
        />
      )}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Mission Enregistrée !
        </h2>
        <p className="text-gray-600">Votre demande a été soumise avec succès</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
            Informations de contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nom</p>
              <p className="font-medium text-gray-900">{data.nom}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-gray-900">{data.email}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Mission</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {data.mission}
            </span>
          </div>
        </div>

        {Object.keys(data.details).length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Détails spécifiques
            </h3>
            <div className="bg-white rounded-lg p-4 font-mono text-sm">
              <pre className="text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(data.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {data.response && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              Message de confirmation
            </h3>
            <p className="text-gray-700 leading-relaxed">{data.response}</p>
          </div>
        )}

        {!showAIAgent && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Agent IA disponible</h3>
                  <p className="text-sm text-gray-600">Cliquez pour voir l'analyse de votre mission</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAgent(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ouvrir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}