import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';

/**
 * Factory para la inicialización de la base de datos.
 * Centraliza la creación de la instancia de la conexión a la base de datos
 * para evitar múltiples inicializaciones.
 */
export class DatabaseFactory {
  private static dbInstances: Map<string, ReturnType<typeof drizzle>> = new Map();

  /**
   * Obtiene una instancia de la base de datos.
   * Si ya existe una instancia para el contexto dado, la devuelve.
   * Si no, crea una nueva instancia.
   * 
   * @param d1Database La instancia de D1Database
   * @param contextId Un identificador opcional para múltiples contextos (por defecto: "default")
   * @returns Una instancia de Drizzle ORM
   */
  static getDatabase(d1Database: D1Database, contextId: string = "default"): ReturnType<typeof drizzle> {
    if (!this.dbInstances.has(contextId)) {
      const dbInstance = drizzle(d1Database);
      this.dbInstances.set(contextId, dbInstance);
    }
    
    return this.dbInstances.get(contextId)!;
  }

  /**
   * Limpia todas las instancias de bases de datos.
   * Útil para pruebas o cuando se necesita reiniciar las conexiones.
   */
  static clearInstances(): void {
    this.dbInstances.clear();
  }
}