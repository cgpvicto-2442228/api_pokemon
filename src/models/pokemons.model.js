import pool from '../config/db.js';

const getPokemon = async (id) => {
    
    // On spécifie LIMIT 1 pour s'assurer de ne récupérer qu'un seul enregistrement
    const requete = `SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = ? LIMIT 1`;
    const params = [id]

    try {
        // Attention: mysql2 retourne un tableau avec deux éléments : les résultats et 
        //      les informations sur les champs
        // Nous n'avons besoin que des résultats ici (décomposition du tableau en ignorant 
        //      le second élément)
        const [resultats] = await pool.query(requete, params);
        // Retourne le premier élément du tableau ou null si vide
        return resultats[0] ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};

const getPagePokemon = async (reqType, reqPage) => {
    try {

        const parPage = 25;
        const page = parseInt(reqPage) || 1;
        const typeFiltre = reqType || "";
        const offset = (page - 1) * parPage;

        let requeteQuantite = "SELECT COUNT(*) as total FROM pokemon";
        let requetePokemon = "SELECT id, nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon";
        let params = [];

        if (typeFiltre) {
            requeteQuantite += " WHERE type_primaire = ?";
            requetePokemon += " WHERE type_primaire = ?";
            params.push(typeFiltre);
        }

        const [countResult] = await pool.query(requeteQuantite, params);
        const nombrePokemonTotal = countResult[0].total;

        console.log(`Debug: Type=${typeFiltre}, Total=${nombrePokemonTotal}`);

        if (nombrePokemonTotal === 0) {
            return [[], typeFiltre, 0, 1, 1];
        }

        requetePokemon += " LIMIT ? OFFSET ?";
        const paramsPokemon = [...params, parPage, offset];
        const [pokemons] = await pool.query(requetePokemon, paramsPokemon);

        const totalPage = Math.ceil(nombrePokemonTotal / parPage);

        return [pokemons, typeFiltre, nombrePokemonTotal, page, totalPage];

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};

const createPokemon = async (requeteNouveauPokemon) => {
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = requeteNouveauPokemon;
    
    const requete = `INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [nom, type_primaire, type_secondaire || null, pv, attaque, defense];

    try {
        const [resultat] = await pool.query(requete, params);
        // Retourne l'id du pokemon ajouté.
        return resultat.insertId;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};

const updatePokemon = async (id, requeteModifiePokemon) => {
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = requeteModifiePokemon;
    
    const requete = `UPDATE pokemon 
                 SET nom = ?, type_primaire = ?, type_secondaire = ?, pv = ?, attaque = ?, defense = ? 
                 WHERE id = ?`;
    const params = [nom, type_primaire, type_secondaire || null, pv, attaque, defense, id];

    try {
        const [resultat] = await pool.query(requete, params);
        // Retourne le nombre de ligne affectées.
        return resultat.affectedRows;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};

const deletePokemon = async (id) => {    
    const requete = `DELETE FROM pokemon WHERE id = ?`;
    const params = [id];

    try {
        const [resultat] = await pool.query(requete, params);
        // Retourne le nombre de ligne affectées.
        return resultat.affectedRows;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};

export default {
    getPokemon,
    getPagePokemon,
    createPokemon,
    updatePokemon,
    deletePokemon
};