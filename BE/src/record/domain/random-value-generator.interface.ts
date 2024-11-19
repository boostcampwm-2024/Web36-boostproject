export abstract class RandomValueGenerator<T> {
    getRandomValue(): T {
        return undefined;
    };
    getRandomValues(length: number): T[] {
        const ret = [];
        for (let i = 0; i < length; i++) {
            ret.push(this.getRandomValue());
        }
        return ret;
    };
}