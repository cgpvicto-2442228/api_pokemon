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


const listePokemon = async (req, res) => {
    try {
        // Appel à la fonction getProfesseur dans le modèle
        const pokemon = await pokemonsModel.getPagePokemon(req.query.type, req.query.page);

        // On retourne un message d'erreur avec le code 404 si aucun professeur n'a été trouvé
        // ** à faire en exercice **

        // OK - on retourne l'objet professeur
        res.status(200).json({
            "pokemons": pokemon[0],
            "type": pokemon[1],
            "nombrePokemonTotal": pokemon[2],
            "page": pokemon[3],
            "totalPage": pokemon[4]
        });

    } catch (erreur) {
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car 
        //  c'est du serveur que provient l'erreur.
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Echec lors de la récupération de la liste des pokemons"
        });
    };
};

const ajouterPokemon = async (req, res) => {
    const champsObligatoires = ["nom", "type_primaire", "pv", "attaque", "defense"];
    const champsManquants = [];

    // Vérification des champs présents dans le req.body
    champsObligatoires.forEach(champ => {
        if (req.body[champ] === undefined || req.body[champ] === "") {
            champsManquants.push(champ);
        }
    });

    // Erreur 400 si des données manquent
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champs_manquants: champsManquants
        });
    }

    try {
        const nouvelId = await pokemonsModel.createPokemon(req.body);

        // Réponse 201 Succès
        res.status(201).json({
            message: `Le pokemon ${req.body.nom} a été ajouté avec succès`,
            pokemon: {
                id: nouvelId,
                ...req.body // On "étale" les données reçues pour reconstruire l'objet
            }
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la création du pokemon ${req.body.nom || 'inconnu'}`
        });
    }
};

const modifierPokemon = async (req, res) => {
    const id = req.params.id;
    const champsObligatoires = ["nom", "type_primaire", "pv", "attaque", "defense"];
    const champsManquants = [];

    // Validation 400 : Vérifier si le JSON contient tous les champs
    champsObligatoires.forEach(champ => {
        if (req.body[champ] === undefined || req.body[champ] === "") {
            champsManquants.push(champ);
        }
    });

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: "Le format des données est invalide",
            champs_manquants: champsManquants
        });
    }

    try {
        const affectedRows = await pokemonsModel.updatePokemon(id, req.body);

        // Validation 404 : Si aucune ligne n'a été mise à jour, l'ID n'existe pas
        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pokemon id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le pokemon id ${id} a été modifié avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la modification du pokemon ${req.body.nom || 'inconnu'}`
        });
    }
};

const supprimerPokemon = async (req, res) => {
    const id = req.params.id;

    try {
        const affectedRows = await pokemonsModel.deletePokemon(id);

        // Validation 404 : Si aucune ligne n'a été mise à jour, l'ID n'existe pas
        if (affectedRows === 0) {
            return res.status(404).json({
                erreur: `Le pokemon id ${id} n'existe pas dans la base de données`
            });
        }

        // Succès 200
        res.status(200).json({
            message: `Le pokemon id ${id} a été supprimé avec succès`
        });

    } catch (erreur) {
        res.status(500).json({
            erreur: `Echec lors de la suppression du pokemon ${req.body.nom || 'inconnu'}`
        });
    }
};

export {
    trouverUnPokemon,
    listePokemon,
    ajouterPokemon,
    modifierPokemon,
    supprimerPokemon
}