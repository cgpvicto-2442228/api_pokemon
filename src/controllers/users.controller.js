import usersModel from '../models/users.model.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const inscrire = async (req, res) => {
    const { nom, courriel, mot_de_passe } = req.body;

    if (!nom || !courriel || !mot_de_passe) {
        return res.status(400).json({ erreur: "Tous les champs sont obligatoires" });
    }

    try {
        const existeDeja = await usersModel.findByEmail(courriel);
        if (existeDeja) return res.status(400).json({ erreur: "Ce courriel est déjà utilisé" });

        const hash = await bcrypt.hash(mot_de_passe, 10);
        const cleApi = uuidv4();

        await usersModel.createUser(nom, courriel, hash, cleApi);

        res.status(201).json({ 
            message: "L'utilisateur a été créé", 
            cle_api: cleApi 
        });
    } catch (erreur) {
        res.status(500).json({ 
            erreur: "Erreur lors de la création" 
        });
    }
};

const recupererCle = async (req, res) => {
    const { courriel, mot_de_passe } = req.body;
    const genererNouvelle = req.query.nouvelle === "1";

    try {
        const user = await usersModel.findByEmail(courriel);
        if (!user || !(await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
            return res.status(401).json({ erreur: "Identifiants invalides" });
        }

        let cleARetourner = user.cle_api;

        if (genererNouvelle) {
            cleARetourner = uuidv4();
            await usersModel.updateApiKey(user.id, cleARetourner);
        }

        res.json({ cle_api: cleARetourner });
    } catch (erreur) {
        res.status(500).json({ erreur: "Erreur serveur" });
    }
};

export { 
    inscrire, 
    recupererCle 
};