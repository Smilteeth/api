import { childTable } from '../../config/db/schema';
import { eq } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';
// import { DatabaseFactory } from '../../core/database.factory';
import { drizzle } from 'drizzle-orm/d1';
import { CreateChildInput } from './child.types';
import { Child } from './child.types';


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
    return drizzle(this.env.DB);
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
  // child.dao.ts (add() corregido)
  async add(child: CreateChildInput): Promise<Child> {
    const now = new Date().toISOString();

    const result = await this.db
      .insert(childTable)
      .values({
        // Mapear snake_case → camelCase (según el schema)
        fatherId: child.fatherId, // ✅
        name: child.name,
        lastName: child.lastName, // ✅
        gender: child.gender,
        birthDate: child.birthDate, // ✅
        morningBrushingTime: child.morningBrushingTime, // ✅
        afternoonBrushingTime: child.afternoonBrushingTime, // ✅
        nightBrushingTime: child.nightBrushingTime, // ✅
        creationDate: now,
        lastModificationDate: now, // ✅
        isActive: true, // ✅
      })
      .returning();

    return result[0] as Child;
  }
}