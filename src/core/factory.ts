import type { D1Database } from '@cloudflare/workers-types';
import { ChildDao } from '../modules/child/child.dao';
import { FatherService } from '../modules/father/father.service';

/**
 * Factory para la creación de DAOs.
 * Centraliza la creación de DAOs y maneja la inyección de dependencias.
 */
export class DaoFactory {
  private static childDaoInstances: Map<string, ChildDao> = new Map();

  /**
   * Obtiene una instancia de ChildDao.
   * Si ya existe una instancia para el contexto dado, la devuelve.
   * Si no, crea una nueva instancia.
   * 
   * @param env El objeto de entorno que contiene la base de datos
   * @param contextId Un identificador opcional para múltiples contextos (por defecto: "default")
   * @returns Una instancia de ChildDao
   */
  static getChildDao(env: { DB: D1Database }, contextId: string = "default"): ChildDao {
    if (!this.childDaoInstances.has(contextId)) {
      const childDao = new ChildDao(env);
      this.childDaoInstances.set(contextId, childDao);
    }
    
    return this.childDaoInstances.get(contextId)!;
  }

  /**
   * Limpia todas las instancias de DAOs.
   * Útil para pruebas o cuando se necesita reiniciar las instancias.
   */
  static clearInstances(): void {
    this.childDaoInstances.clear();
  }
}

/**
 * Factory para la creación de Services.
 * Centraliza la creación de Services y maneja la inyección de dependencias.
 */
export class ServiceFactory {
  private static fatherServiceInstances: Map<string, FatherService> = new Map();

  /**
   * Obtiene una instancia de FatherService.
   * Si ya existe una instancia para el contexto dado, la devuelve.
   * Si no, crea una nueva instancia.
   * 
   * @param env El objeto de entorno que contiene la base de datos
   * @param contextId Un identificador opcional para múltiples contextos (por defecto: "default")
   * @returns Una instancia de FatherService
   */
  static getFatherService(env: { DB: D1Database }, contextId: string = "default"): FatherService {
    if (!this.fatherServiceInstances.has(contextId)) {
      const fatherService = new FatherService(env);
      this.fatherServiceInstances.set(contextId, fatherService);
    }
    
    return this.fatherServiceInstances.get(contextId)!;
  }

  /**
   * Limpia todas las instancias de Services.
   * Útil para pruebas o cuando se necesita reiniciar las instancias.
   */
  static clearInstances(): void {
    this.fatherServiceInstances.clear();
  }
}