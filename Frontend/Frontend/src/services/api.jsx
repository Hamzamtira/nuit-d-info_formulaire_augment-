export async function sendSubmission(payload) {
  try {
    const res = await fetch("http://localhost:3000/api/submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // 🔥 Vérifie si le serveur répond avec une erreur HTTP
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Erreur serveur (${res.status}) : ${errorText || "Réponse invalide"}`
      );
    }

    // 🔥 Ensure JSON parsing safe
    const data = await res.json();
    return data;

  } catch (error) {
    console.error("❌ Erreur sendSubmission:", error);

    // 🔥 Retourne une réponse propre au frontend
    return {
      success: false,
      error: error.message || "Impossible d'envoyer la mission.",
    };
  }
}

export async function askAI(message) {
  try {
    const res = await fetch("http://localhost:3000/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Erreur serveur (${res.status}) : ${errorText || "Réponse invalide"}`
      );
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("❌ Erreur askAI:", error);
    return {
      success: false,
      error: error.message || "Impossible d'obtenir une réponse IA.",
    };
  }
}