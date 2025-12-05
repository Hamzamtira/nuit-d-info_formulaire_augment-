module.exports = {
    submission(req, res, next) {
        if (!req.body.userInput || typeof req.body.userInput !== "string") {
            return res.status(400).json({ error: "Le champ 'userInput' est requis." });
        }
        next();
    }
};
