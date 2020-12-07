import {MasterModel} from './master.model';

export interface CklServiceInterface<T extends MasterModel> {

  create(dto: T);
  createAll(dto: T[]);
  isValid(dto: T[]): boolean;

  update(dto: T);
  updateAll(dto: T[]);

  getOne(dto: T);
  getAll(dto: T): T[];
  search(dto: T);

  delete(dto: T);
  deleteAll(oids: string[]);

  getUrl(): string;

}
