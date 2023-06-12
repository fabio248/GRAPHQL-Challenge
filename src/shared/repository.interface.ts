export interface GenericRepository<T> {
  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: object;
    where?: object;
  }): Promise<T[]>;
  findOne(where: object): Promise<T | null>;
  create(data: object): Promise<T>;
  update(params: { where: object; data: object }): Promise<T>;
  delete(where: object): Promise<T>;
}
