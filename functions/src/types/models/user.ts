import { DocumentBase } from '../base';

export interface User extends DocumentBase {
  availablePoint: number;
  isDeleted: boolean;
}
