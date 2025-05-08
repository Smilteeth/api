// gepetaso

import { Hono } from 'hono';
import { FatherController } from './father.controller';

const fatherRoutes = new Hono();
const controller = new FatherController();

/**
 * Ruta GET /fathers/:id/sons - obtiene los hijos de un padre por ID.
 */
fatherRoutes.get('/fathers/:id/sons', (c) => controller.getSons(c));

/**
 * Ruta POST /fathers/:id/sons - agrega un hijo a un padre por ID.
 */
fatherRoutes.post('/fathers/:id/sons', (c) => controller.addSon(c));

export default fatherRoutes;
