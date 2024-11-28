import { RandomValueGenerator } from './random-value-generator.interface';

export class BooleanGenerator extends RandomValueGenerator<number> {
  getRandomValue(): number {
    return Math.random() > 0.5 ? 0 : 1;
  }
}
