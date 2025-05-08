// Objeto Logica de negocio

// Todo lo que se puede hacer (metodos y lo logico)

import { ChildDao } from '../child/child.dao';
import { Child, CreateChildInput } from '../child/child.types';
import type { D1Database } from '@cloudflare/workers-types';


// const childDao = new ChildDao();

export class FatherService {
  // Instancia del DAO de hijos
  private childDao: ChildDao;

  constructor(env: { DB: D1Database }) {
    this.childDao = new ChildDao(env);
  }
  /**
   * Obtiene todos los hijos de un padre específico.
   * 
   * @param fatherId 
   * @returns 
   */
  async getSons(fatherId: number): Promise<Child[]> {
    const allChildren = await this.childDao.getAll();
    return allChildren.filter(child => child.father_id === fatherId);
  }

  /**
   * Crear un hijo para un padre específico.
   * 
   * @param fatherId 
   * @param data 
   * @returns {Promise<Child>}
   */
  async addSon(fatherId: number, data: Omit<CreateChildInput, 'father_id'>): Promise<Child> {
    const {
      name,
      last_name,
      gender,
      birth_date,
      morning_brushing_time,
      afternoon_brushing_time,
      night_brushing_time
    } = data;

    if (!name || !last_name || !gender || !birth_date || !morning_brushing_time ||
        !afternoon_brushing_time || !night_brushing_time) {
      throw new Error('Todos los campos del hijo son obligatorios.');
    }

    return await this.childDao.add({
      ...data,
      father_id: fatherId
    });
  }
}

// Creacion de la clase FatherService
// export class FatherService {
//   // Instancia del DAO de hijos
//   private childDao: ChildDao;

//   constructor() {
//     this.childDao = new ChildDao();

  
//     /**
//      * Obtiene todos los hijos de un padre específico.
//      * 
//      * @param fatherId 
//      * @returns 
//      */
//     export async function getSons(fatherId: number): Promise<Child[]> {
//       const allChildren = await childDao.getAll();
//       return allChildren.filter(child => child.father_id === fatherId);
//     }

//     /**
//      * Crear un hijo para un padre específico.
//      * 
//      * @param fatherId 
//      * @param data 
//      * @returns {Promise<Child>}
//      */
//     export async function addSon(fatherId: number, data: Omit<CreateChildInput, 'father_id'>): Promise<Child> {
      
//         // Validación simple
//         const { name, last_name, gender, birth_date, morning_brushing_time,
//             afternoon_brushing_time, night_brushing_time } = data;

//         if (!name || !last_name || !gender || !birth_date || !morning_brushing_time 
//             || !afternoon_brushing_time || !night_brushing_time)
//         {
//             throw new Error('Todos los campos del hijo son obligatorios.');
//         }

//         // retorna el hijo creado
        
//         return await childDao.add({
//           ...data,
//           father_id: fatherId,
//           name: '',
//           last_name: '',
//           gender: 'M',
//           birth_date: '',
//           morning_brushing_time: '',
//           afternoon_brushing_time: '',
//           night_brushing_time: ''
//       });
//     }

//   }
// }