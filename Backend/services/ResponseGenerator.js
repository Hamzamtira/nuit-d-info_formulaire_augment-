const fs = require("fs");
const path = require("path");

class ResponseGenerator {
    static async generate(userInput) {
        const templatePath = path.join(__dirname, "../templates/responses.json");
        const responses = JSON.parse(fs.readFileSync(templatePath, "utf8"));

        // Exemple simple : choisir réponse par similarité
        return responses.default.replace("{{input}}", userInput);
    }
}

module.exports = ResponseGenerator;
