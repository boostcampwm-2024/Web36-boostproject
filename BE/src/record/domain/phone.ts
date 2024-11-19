import { RandomValueGenerator } from "./random-value-generator.interface";

export class PhoneGenerator extends RandomValueGenerator<string> {
    getValue(): string {
        const prefix = "010"; 
        const middle = Math.floor(1000 + Math.random() * 9000).toString(); 
        const last = Math.floor(1000 + Math.random() * 9000).toString(); 
        return `${prefix}-${middle}-${last}`;
    }
}