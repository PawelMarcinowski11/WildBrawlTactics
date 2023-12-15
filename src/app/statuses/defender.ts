import { StatusKeys } from '../enums/status-keys';
import { IStatus } from '../interfaces';

export class Defender implements IStatus {
  constructor(
    public duration = 1,
    public appearance = 'u1f6e1',
    public description = `Opponents can't target other characters and must attack this character instead`,
    public key = StatusKeys.DEFENDER,
    public name = 'Defender',
  ) {}
}
