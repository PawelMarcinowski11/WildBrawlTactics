import { StatusKeys } from '../enums/status-keys';
import { IStatus } from '../interfaces';

export class Defender implements IStatus {
  constructor(
    public duration = 1,
    public appearance = '🛡️',
    public description = `Attackers can't target other units and must attack defender instead`,
    public key = StatusKeys.DEFENDER,
    public name = 'Defender',
  ) {}
}
