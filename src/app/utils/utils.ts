export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

declare global {
  interface Array<T> {
    shuffle(): any[];
  }
}

Array.prototype.shuffle = function () {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }

  return this;
};
