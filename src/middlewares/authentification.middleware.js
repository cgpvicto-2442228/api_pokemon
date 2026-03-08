import usersModel from '../models/users.model.js';

export const authKey = async (req, res, next) => {
    const authHeader = req.headers.authorization; // Format attendu: "cle_api 3b24..."

    if (!authHeader || !authHeader.startsWith("cle_api ")) {
        return res.status(401).json({ erreur: "Clé API manquante ou format invalide (doit commencer par 'cle_api ')" });
    }

    const cle = authHeader.split(" ")[1];

    try {
        const user = await usersModel.findByApiKey(cle);
        if (!user) {
            return res.status(403).json({ erreur: "Clé API invalide" });
        }

        // On peut attacher l'utilisateur à la requête pour l'utiliser plus tard
        req.user = user;
        next(); // On passe au contrôleur suivant
    } catch (erreur) {
        res.status(500).json({ erreur: "Erreur lors de l'authentification" });
    }
};