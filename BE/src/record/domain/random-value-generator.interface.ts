export abstract class RandomValueGenerator<T> {
    getRandomValue(): T {
        return undefined;
    }
    getRandomValues(length: number, blank: number): (T | string)[] {
        if (blank === 0) return Array.from({ length }, () => this.getRandomValue());
        if (blank === 100) return new Array(length).fill('NULL');
        return Array.from({ length }, () =>
            Math.random() * 100 > blank ? this.getRandomValue() : 'NULL'
        );
    }
}
