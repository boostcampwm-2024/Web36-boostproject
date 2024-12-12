import {
  BooleanGenerator,
  CityGenerator,
  CountryGenerator,
  EmailGenerator,
  NameGenerator,
  PhoneGenerator,
  SexGenerator,
} from '../domain';

export const RANDOM_DATA_TEMP_DIR = 'csvTemp';
export const RECORD_PROCESS_BATCH_SIZE = 100000;

export const generalDomain = [
  'name',
  'country',
  'city',
  'email',
  'phone',
  'sex',
  'boolean',
];

export const TypeToConstructor = {
  name: NameGenerator,
  country: CountryGenerator,
  city: CityGenerator,
  email: EmailGenerator,
  phone: PhoneGenerator,
  sex: SexGenerator,
  boolean: BooleanGenerator,
};

export const DomainToTypes = {
  name: 'string',
  country: 'string',
  city: 'string',
  email: 'string',
  phone: 'string',
  sex: 'string',
  boolean: 'number',
  number: 'number',
  enum: 'string',
};

export const mysqlToJsType = (mysqlType: string): string => {
  const baseType = mysqlType.split('(')[0];
  const typeMap: Record<string, string> = {
    VARCHAR: 'string',
    CHAR: 'string',
    TEXT: 'string',
    INT: 'number',
    TINYINT: 'number',
    BIGINT: 'number',
    FLOAT: 'number',
    DOUBLE: 'number',
    DECIMAL: 'number',
    DATETIME: 'string',
    DATE: 'string',
    TIMESTAMP: 'string',
  };
  return typeMap[baseType.toUpperCase()] || 'unknown';
};
