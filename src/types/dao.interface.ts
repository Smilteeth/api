export interface DataAccessObject<T> {
    create(data: T): void;
    getById(id: number): T;
}
