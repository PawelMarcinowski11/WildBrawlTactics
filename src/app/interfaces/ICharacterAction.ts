export interface ICharacterAction {
  amount: number;
  name: string;
  target: 'ally' | 'enemy';
  type: 'damage' | 'heal';
  uses?: number;
  uses_left?: number;
}
