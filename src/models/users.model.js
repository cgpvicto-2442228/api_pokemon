import pool from '../config/db_pg.js';

const createUser = async (nom, courriel, passwordHash, cleApi) => {
    const requete = `INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES ($1, $2, $3, $4) RETURNING id`;
    const params = [nom, courriel, passwordHash, cleApi];
    const resultat = await pool.query(requete, params);
    return resultat.rows[0].id;
};

const findByEmail = async (courriel) => {
    const lignes = await pool.query("SELECT * FROM utilisateurs WHERE courriel = $1", [courriel]);
    return lignes.rows[0];
};

const findByApiKey = async (cleApi) => {
    const lignes = await pool.query("SELECT * FROM utilisateurs WHERE cle_api = $1", [cleApi]);
    return lignes.rows[0];
};

const updateApiKey = async (userId, newApiKey) => {
    await pool.query("UPDATE utilisateurs SET cle_api = $1 WHERE id = $2", [newApiKey, userId]);
};

export default { 
    createUser, 
    findByEmail, 
    findByApiKey, 
    updateApiKey 
};