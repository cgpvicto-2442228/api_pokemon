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

export default {
    getPokemon
}