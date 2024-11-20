export abstract class RandomValueGenerator<T> {
  getRandomValue(): T {
    return undefined;
  }
  getRandomValues(length: number, blank: number): T[] {
    let ret = [];
    if (blank === 0)
      for (let i = 0; i < length; i++) {
        ret.push(this.getRandomValue());
      }
    else if (blank === 100) ret = new Array(length).fill('NULL');
    else {
      for (let i = 0; i < length; i++) {
        if (Math.random() * 100 > blank) ret.push(this.getRandomValue());
        else ret.push('NULL');
      }
    }
    return ret;
  }
}
