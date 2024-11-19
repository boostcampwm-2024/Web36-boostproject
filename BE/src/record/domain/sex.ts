import { RandomValueGenerator } from "./random-value-generator.interface";

export class SexGenerator extends RandomValueGenerator<string> {
    getValue(): string {
        return (Math.random() > 0.5) ? 'male' : 'female';
    }
}