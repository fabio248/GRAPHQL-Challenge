export interface GenericRepository<T> {
  findAll(): Promise<T[]>;
  findOne(where: object): Promise<T | null>;
  create(data: object): Promise<T>;
  update(params: { where: object; data: object }): Promise<T>;
  delete(where: object): Promise<T>;
}
