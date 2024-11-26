import {
    BooleanGenerator,
    CityGenerator,
    CountryGenerator,
    EmailGenerator,
    NameGenerator,
    PhoneGenerator,
    SexGenerator
} from "../domain";

export const RANDOM_DATA_TEMP_DIR = 'csvTemp';
export const RECORD_PROCESS_BATCH_SIZE = 10000;

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