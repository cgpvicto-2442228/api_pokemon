import pokemonsModel from "../models/pokemons.model.js";

const trouverUnPokemon = async (req, res) => {

    // Teste si le paramètre id est présent et valide
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        // Appel à la fonction getProfesseur dans le modèle
        const pokemon = await pokemonsModel.getPokemon(req.params.id);

        // On retourne un message d'erreur avec le code 404 si aucun professeur n'a été trouvé
        // ** à faire en exercice **

        // OK - on retourne l'objet professeur
        res.send(pokemon);

    } catch (erreur) {
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car 
        //  c'est du serveur que provient l'erreur.
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemon avec l'id " + req.params.id
        });
    };
};

// PAS FAIT !!!
const listePokemon = async (req, res) => {

    // Teste si le paramètre id est présent et valide
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        // Appel à la fonction getProfesseur dans le modèle
        const pokemon = await pokemonsModel.getPokemon(req.params.id);

        // On retourne un message d'erreur avec le code 404 si aucun professeur n'a été trouvé
        // ** à faire en exercice **

        // OK - on retourne l'objet professeur
        res.send(pokemon);

    } catch (erreur) {
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car 
        //  c'est du serveur que provient l'erreur.
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemon avec l'id " + req.params.id
        });
    };
};

export {
    trouverUnPokemon,
    listePokemon
}