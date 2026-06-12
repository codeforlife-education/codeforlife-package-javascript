export declare function getNestedProperty(obj: Record<string, any>, dotPath: string | string[]): any;
export declare function withKeyPaths(obj: object, delimiter?: string): object;
export declare function getKeyPaths(obj: object, delimiter?: string): string[];
export declare function excludeKeyPaths(obj: object, exclude: string[], delimiter?: string): any;
type JoinPath<A extends string, B extends string, D extends string> = A extends "" ? B : `${A}${D}${B}`;
type PrefixedValues<T extends object, Path extends string = "", D extends string = "."> = {
    [K in keyof T & string]: T[K] extends object ? PrefixedValues<T[K], JoinPath<Path, K, D>, D> : `${JoinPath<Path, K, D>}${D}${T[K] & (string | number | bigint | boolean | null | undefined)}`;
};
export declare function prefixValuesWithKeyPath<const T extends object>(obj: T): PrefixedValues<T>;
export declare function prefixValuesWithKeyPath<const T extends object, D extends string>(obj: T, delimiter: D): PrefixedValues<T, "", D>;
export {};
