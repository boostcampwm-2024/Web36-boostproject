import { RandomValueGenerator } from './random-value-generator.interface';

export class SexGenerator extends RandomValueGenerator<string> {
  getRandomValue(): string {
    return Math.random() > 0.5 ? 'Male' : 'Female';
  }
}
