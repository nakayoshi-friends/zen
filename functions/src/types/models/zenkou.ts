import { DocumentBase } from '../base';

export interface Zenkou extends DocumentBase {
  content: string;
  donatedPointList: DonatedPoint[];
  isDeleted: boolean;
}

export interface DonatedPoint {
  userId: string;
  point: number;
}
