import { childTable } from '../../config/db/schema';
import { eq } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';
import { DatabaseFactory } from '../../core/database.factory';

/**
 * Clase de acceso a datos (DAO) para la entidad Child.
 * Maneja todas las operaciones de base de datos relacionadas con los niños.
 */
export class ChildDao {
  /**
   * Constructor que recibe el entorno con la base de datos.
   * @param env Objeto que contiene la instancia de D1Database
   */
  constructor(private env: { DB: D1Database }) {}

  /**
   * Obtiene la instancia de la base de datos a través del factory.
   * @returns Instancia de Drizzle ORM
   */
  private get db() {
    return DatabaseFactory.getDatabase(this.env.DB);
  }

  /**
   * Obtiene todos los niños activos en la base de datos.
   * @returns Promise con array de niños
   */
  async getAll(): Promise<any[]> {
    return await this.db
      .select()
      .from(childTable)
      .where(eq(childTable.isActive, true));
  }

  /**
   * Agrega un nuevo niño a la base de datos.
   * @param child Objeto con los datos del niño a agregar
   * @returns Promise con el niño agregado
   */
  async add(child: {
    father_id: number;
    name: string;
    last_name: string;
    gender: 'M' | 'F';
    birth_date: string;
    morning_brushing_time: string;
    afternoon_brushing_time: string;
    night_brushing_time: string;
  }): Promise<any> {
    const now = new Date().toISOString();

    const result = await this.db
      .insert(childTable)
      .values({   // FIXME: ME da error pero no entiendo del todo por qué
        ...child,
        creationDate: now,
        last_modification_date: now,
        is_active: true,
      })
      .returning();

    return result[0];
  }
}