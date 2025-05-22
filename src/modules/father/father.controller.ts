import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { D1Database } from '@cloudflare/workers-types';
import { ServiceFactory } from '../../core/factory';

/**
 * Controlador para manejar operaciones relacionadas con el padre.
 * Se comunica con FatherService para acceder a los datos de los hijos.
 */
export class FatherController {
  /**
   * Constructor que almacena el entorno para pasarlo a los servicios.
   * @param env Objeto que contiene la instancia de D1Database
   */
  constructor(private env: { DB: D1Database }) {}

  /**
   * Maneja la solicitud para obtener los hijos de un padre específico.
   *
   * @param {Context} c - Contexto de Hono con la solicitud y respuesta.
   * @returns {Promise<Response>} Respuesta con los datos de los hijos o un error.
   * @throws {HTTPException} Si el ID no es válido o ocurre un error de servidor.
   */
  async getSons(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id');

      // Verificar si se proporcionó el ID
      if (!id) {
        throw new HTTPException(400, { message: 'ID is required' });
      }

      // Obtener el servicio a través del factory
      const fatherService = ServiceFactory.getFatherService(this.env);
      
      // Llamar al servicio para obtener los hijos del padre
      const sons = await fatherService.getSons(Number(id));

      // Verifica si se obtuvo la respuesta del servicio
      if (!sons || sons.length === 0) {
        throw new HTTPException(404, { message: 'Sons not found' });
      }

      // Retornar la respuesta al cliente
      return c.json({ message: sons });

    } catch (error: any) {
      throw new HTTPException(500, { message: 'Server error', cause: error });
    }
  }

  /**
   * Maneja la solicitud para agregar un hijo a un padre específico.
   *
   * @param {Context} c - Contexto de Hono con la solicitud y respuesta.
   * @returns {Promise<Response>} Respuesta con el hijo agregado o un error.
   * @throws {HTTPException} Si el ID del padre no es válido o ocurre un error de servidor.
   */
  // Versión CORRECTA
  async addSon(c: Context): Promise<Response> {
    try {
      const father_id = Number(c.req.param('id'));
      const childData = await c.req.json();
      if (isNaN(father_id)) {
        throw new HTTPException(400, { message: 'ID inválido' });
      }

      const fatherService = ServiceFactory.getFatherService(this.env);
      const son = await fatherService.addSon(father_id, childData);

      return c.json(son, 201);
    } catch (error: any) {
      throw new HTTPException(500, { message: 'Server error', cause: error });
    }
  }
}