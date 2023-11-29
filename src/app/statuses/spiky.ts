import { StatusKeys } from '../enums/status-keys';
import { IStatus } from '../interfaces';

export class Spiky implements IStatus {
  constructor(
    public duration = Infinity,
    public appearance = '🦔',
    public description = `Attackers targeting this character receive 2 damage`,
    public key = StatusKeys.SPIKY,
    public name = 'Spiky',
  ) {}
}