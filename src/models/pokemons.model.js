import pool from '../config/db_pg.js';

const getPokemon = async (id) => {
    
    // On spécifie LIMIT 1 pour s'assurer de ne récupérer qu'un seul enregistrement
    const requete = `SELECT nom, type_primaire, type_secondaire, pv, attaque, defense FROM pokemon WHERE id = $1 LIMIT 1`;
    const params = [id];

    try {
        // Attention: mysql2 retourne un tableau avec deux éléments : les résultats et 
        //      les informations sur les champs
        // Nous n'avons besoin que des résultats ici (décomposition du tableau en ignorant 
        //      le second élément)
        const resultat = await pool.query(requete, params);
        // Retourne le premier élément du tableau ou null si vide
        return resultat.rows[0] || null;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
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
            requeteQuantite += " WHERE type_primaire = $1";
            requetePokemon += " WHERE type_primaire = $1";
            params.push(typeFiltre);
        }

        const quantite = await pool.query(requeteQuantite, params);
        const nombrePokemonTotal = quantite.rows[0].total;

        console.log(`Debug: Type=${typeFiltre}, Total=${nombrePokemonTotal}`);

        if (nombrePokemonTotal === 0) {
            return [[], typeFiltre, 0, 1, 1];
        }

        const indexLimit = params.length + 1;
        const indexOffset = params.length + 2;

        requetePokemon += ` LIMIT $${indexLimit} OFFSET $${indexOffset}`;
        const paramsPokemon = [...params, parPage, offset];
        const pokemons = await pool.query(requetePokemon, paramsPokemon);

        const totalPage = Math.ceil(nombrePokemonTotal / parPage);

        return [pokemons.rows, typeFiltre, nombrePokemonTotal, page, totalPage];

    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const createPokemon = async (requeteNouveauPokemon) => {
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = requeteNouveauPokemon;
    
    const requete = `INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const params = [nom, type_primaire, type_secondaire || null, pv, attaque, defense];

    try {
        const resultat = await pool.query(requete, params);
        // Retourne l'id du pokemon ajouté.
        return resultat.rows[0].id;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const updatePokemon = async (id, requeteModifiePokemon) => {
    const {nom, type_primaire, type_secondaire, pv, attaque, defense} = requeteModifiePokemon;
    
    const requete = `UPDATE pokemon 
                 SET nom = $1, type_primaire = $2, type_secondaire = $3, pv = $4, attaque = $5, defense = $6 
                 WHERE id = $7`;
    const params = [nom, type_primaire, type_secondaire || null, pv, attaque, defense, id];

    try {
        const resultat = await pool.query(requete, params);
        // Retourne le nombre de ligne affectées.
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

const deletePokemon = async (id) => {    
    const requete = `DELETE FROM pokemon WHERE id = $1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        // Retourne le nombre de ligne affectées.
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur PostgreSQL : ${erreur.code} : ${erreur.message}`);
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