import { trouverUnPokemon, listePokemon } from '../controllers/pokemons.controller.js';

// Nous avons besoin d'importer le module express pour utiliser la classe Router
import express from 'express';
// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

router.get('/:id', trouverUnPokemon);
router.get('/liste?page=1&type=grass', listePokemon);

export default router;