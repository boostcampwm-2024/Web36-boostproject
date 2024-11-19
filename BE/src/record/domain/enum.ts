import { RandomValueGenerator } from "./random-value-generator.interface";

export class EnumGenerator extends RandomValueGenerator<string> {
    constructor(private enums: string[]) {
        super();
    }

    getValue(): string {
        const enumIdx = Math.floor(Math.random() * this.enums.length);
        return this.enums[enumIdx];
    }
}