// Objeto Logica de negocio

// Todo lo que se puede hacer (metodos y lo logico)

import type { D1Database } from '@cloudflare/workers-types';
import { Child, CreateChildInput } from '../child/child.types';
import { ChildDao } from '../child/child.dao';

/**
 * Servicio para la lógica de negocio relacionada con los padres.
 * Utiliza el DAO de niños para acceder a los datos.
 */
export class FatherService {
  /**
   * Constructor que inicializa el servicio con el entorno.
   * @param env Objeto que contiene la instancia de D1Database
   */
  private childDao: ChildDao;

  constructor(private env: { DB: D1Database }) {
    this.childDao = new ChildDao(env);
  }
  
  /**
   * Obtiene todos los hijos de un padre específico.
   * 
   * @param fatherId ID del padre cuyos hijos se desean obtener
   * @returns Promise con un array de objetos Child
   */
  async getSons(fatherId: number): Promise<Child[]> {
    // // Obtiene el DAO a través del factory
    // const childDao = DaoFactory.getChildDao(this.env);
    
    const allChildren = await this.childDao.getAll();
    return allChildren.filter((child: Child) => child.fatherId === fatherId);
  }

  /**
   * Crea un hijo para un padre específico.
   * 
   * @param fatherId ID del padre al que se le asignará el hijo
   * @param data Datos del hijo a crear
   * @returns Promise con el objeto Child creado
   * @throws Error si algún campo requerido está ausente
   */
  async addSon(fatherId: number, data: Omit<CreateChildInput, 'fatherId'>) {  
  // Validar campos en camelCase  
  if (!data.name || !data.lastName) {
      throw new Error('Campos requeridos faltantes');
    }

    return await this.childDao.add({
      ...data,
      fatherId,
    });
  }
}