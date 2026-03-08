import express from 'express';
import { inscrire, recupererCle } from '../controllers/users.controller.js';
const router = express.Router();

router.post('/', inscrire);
router.get('/cle', recupererCle);

export default router;