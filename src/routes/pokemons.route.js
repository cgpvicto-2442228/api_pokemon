import { trouverUnPokemon, listePokemon, ajouterPokemon, modifierPokemon, supprimerPokemon } from '../controllers/pokemons.controller.js';

// Nous avons besoin d'importer le module express pour utiliser la classe Router
import express from 'express';
import { authKey } from '../middlewares/authentification.middleware.js';
// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

router.get('/liste', listePokemon);
router.get('/:id', trouverUnPokemon);
router.post('/', ajouterPokemon);
router.put('/:id', modifierPokemon);
router.delete('/:id', authKey, supprimerPokemon);

export default router;