import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { FatherService } from './father.service';

/**
 * Controlador para manejar operaciones relacionadas con el padre.
 * Se comunica con FatherService para acceder a los datos de los hijos.
 */
export class FatherController {
  /** Servicio que maneja la lógica de negocio relacionada con el padre. */
  private fatherService: FatherService;

  /**
   * Constructor que instancia el servicio necesario.
   * 
   * HACK: Utilice el DB:D1DataBase como sulución rapida para importaciones
   *    Esto en services, child.dao y controller
   */
  constructor(env: { DB: D1Database }) {
    this.fatherService = new FatherService(env);
  }

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

      // Llamar al servicio para obtener los hijos del padre
      const sons = await this.fatherService.getSons(Number(id));

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

  // POST
  /**
   * Maneja la solicitud para agregar un hijo a un padre específico.
   *
   * @param {Context} c - Contexto de Hono con la solicitud y respuesta.
   * @returns {Promise<Response>} Respuesta con el hijo agregado o un error.
   * @throws {HTTPException} Si el ID del padre no es válido o ocurre un error de servidor.
   */
  async addSon(c: Context): Promise<Response> {
    try {
      const body = await c.req.json();


      // Verificar si se proporcionó el ID del padre
      if (!body.father_id) {
        throw new HTTPException(400, { message: 'Father ID is required' });
      }

      // Llamar al servicio para agregar un hijo
      const { father_id, ...childData } = body;
      const son = await this.fatherService.addSon(father_id, childData);

      // Retornar la respuesta al cliente
      return c.json({ message: son });

    } catch (error: any) {
      throw new HTTPException(500, { message: 'Server error', cause: error });
    }
  }

  // Funcion para eliminar un hijo ???
}