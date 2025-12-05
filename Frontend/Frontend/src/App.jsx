import React, { useState } from "react";
import Formulaire from "./components/Formulaire.jsx";
import Confirmation from "./components/Confirmation.jsx";
import "./index.css";


export default function App() {
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = (response) => {
    setSubmittedData(response);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-cyan-400">Nexus Connecté</h1>
      {submittedData ? (
        <Confirmation data={submittedData} />
      ) : (
        <Formulaire onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
