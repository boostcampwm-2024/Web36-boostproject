import { Domains } from './dto/record.dto';
import { RandomValueGenerator } from './domain';

export interface RandomColumnEntity {
  name: string;
  type: Domains;
  generator: RandomValueGenerator<any>;
  data: string[];
  blank: number;
}
