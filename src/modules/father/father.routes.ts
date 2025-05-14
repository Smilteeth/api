import { Hono } from 'hono';
import { FatherController } from './father.controller';
import type { D1Database } from '@cloudflare/workers-types';

/**
 * Crea y configura las rutas relacionadas con el padre.
 * 
 * @param env Objeto que contiene la instancia de D1Database
 * @returns Instancia de Hono con las rutas configuradas
 */
export function createFatherRoutes(env: { DB: D1Database }): Hono {
  const fatherRoutes = new Hono();
  
  // Inicializa el controlador con la instancia de la base de datos
  const controller = new FatherController(env);

  /**
   * Ruta GET /fathers/:id/sons - obtiene los hijos de un padre por ID.
   */
  fatherRoutes.get('/fathers/:id/sons', (c) => controller.getSons(c));

  /**
   * Ruta POST /fathers/:id/sons - agrega un hijo a un padre por ID.
   */
  fatherRoutes.post('/fathers/:id/sons', (c) => controller.addSon(c));

  return fatherRoutes;
}