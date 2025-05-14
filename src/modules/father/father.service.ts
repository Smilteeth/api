// Objeto Logica de negocio

// Todo lo que se puede hacer (metodos y lo logico)

import type { D1Database } from '@cloudflare/workers-types';
import { Child, CreateChildInput } from '../child/child.types';
import { DaoFactory } from '../../core/factory';

/**
 * Servicio para la lógica de negocio relacionada con los padres.
 * Utiliza el DAO de niños para acceder a los datos.
 */
export class FatherService {
  /**
   * Constructor que inicializa el servicio con el entorno.
   * @param env Objeto que contiene la instancia de D1Database
   */
  constructor(private env: { DB: D1Database }) {}
  
  /**
   * Obtiene todos los hijos de un padre específico.
   * 
   * @param fatherId ID del padre cuyos hijos se desean obtener
   * @returns Promise con un array de objetos Child
   */
  async getSons(fatherId: number): Promise<Child[]> {
    // Obtiene el DAO a través del factory
    const childDao = DaoFactory.getChildDao(this.env);
    
    const allChildren = await childDao.getAll();
    return allChildren.filter((child: { father_id: number; }) => child.father_id === fatherId);
  }

  /**
   * Crea un hijo para un padre específico.
   * 
   * @param fatherId ID del padre al que se le asignará el hijo
   * @param data Datos del hijo a crear
   * @returns Promise con el objeto Child creado
   * @throws Error si algún campo requerido está ausente
   */
  async addSon(fatherId: number, data: Omit<CreateChildInput, 'father_id'>): Promise<Child> {
    // Obtiene el DAO a través del factory
    const childDao = DaoFactory.getChildDao(this.env);
    
    const {
      name,
      last_name,
      gender,
      birth_date,
      morning_brushing_time,
      afternoon_brushing_time,
      night_brushing_time
    } = data;

    // Validación de campos requeridos
    if (!name || !last_name || !gender || !birth_date || !morning_brushing_time ||
        !afternoon_brushing_time || !night_brushing_time) {
      throw new Error('Todos los campos del hijo son obligatorios.');
    }

    // Crea el hijo a través del DAO
    return await childDao.add({
      ...data,
      father_id: fatherId
    });
  }
}