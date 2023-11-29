import { StatusKeys } from '../enums/status-keys';

export interface IStatus {
  appearance: string;
  description: string;
  key: StatusKeys;
  duration: number;
  name: string;
}
