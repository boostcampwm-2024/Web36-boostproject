import { RandomValueGenerator } from "./random-value-generator.interface";

export class NumberGenerator extends RandomValueGenerator<number> {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        super();
        this.min = Math.floor(min);
        this.max = Math.floor(max);
    }

    getValue(): number {
        const num = Math.floor(this.min + (Math.random() * (this.max - this.min + 1)))
        return num;
    }
}