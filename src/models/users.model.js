import pool from '../config/db.js';

const createUser = async (nom, courriel, passwordHash, cleApi) => {
    const requete = `INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES (?, ?, ?, ?)`;
    const params = [nom, courriel, passwordHash, cleApi];
    const [resultat] = await pool.query(requete, params);
    return resultat.insertId;
};

const findByEmail = async (courriel) => {
    const [lignes] = await pool.query("SELECT * FROM utilisateurs WHERE courriel = ?", [courriel]);
    return lignes[0];
};

const findByApiKey = async (cleApi) => {
    const [lignes] = await pool.query("SELECT * FROM utilisateurs WHERE cle_api = ?", [cleApi]);
    return lignes[0];
};

const updateApiKey = async (userId, newApiKey) => {
    await pool.query("UPDATE utilisateurs SET cle_api = ? WHERE id = ?", [newApiKey, userId]);
};

export default { 
    createUser, 
    findByEmail, 
    findByApiKey, 
    updateApiKey 
};