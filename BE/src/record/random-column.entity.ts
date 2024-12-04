import { RandomValueGenerator } from './domain';
import { Domains } from '../../../schemas/record';

export interface RandomColumnModel {
  name: string;
  type: Domains;
  generator: RandomValueGenerator<any>;
  data: string[];
  blank: number;
}
