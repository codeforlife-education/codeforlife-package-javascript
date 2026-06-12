/** Recursively extracts all numeric values from a nested object structure. */
export type DeepNumbersOf<T> = T extends number ? T : T extends object ? DeepNumbersOf<T[keyof T]> : never;
/** Recursively extracts all string values from a nested object structure. */
export type DeepStringsOf<T> = T extends string ? T : T extends object ? DeepStringsOf<T[keyof T]> : never;
export declare function flattenNumberValues<T extends object>(obj: T): DeepNumbersOf<T>[];
export declare function flattenStringValues<T extends object>(obj: T): DeepStringsOf<T>[];
export declare function getNestedProperty(obj: Record<string, any>, dotPath: string | string[]): any;
export declare function withKeyPaths(obj: object, delimiter?: string): object;
export declare function getKeyPaths(obj: object, delimiter?: string): string[];
export declare function excludeKeyPaths(obj: object, exclude: string[], delimiter?: string): any;
type JoinPath<A extends string, B extends string, D extends string> = A extends "" ? B : `${A}${D}${B}`;
export type PathStringMap<T extends object, Path extends string = "", D extends string = "."> = T extends readonly (infer E extends string)[] ? {
    [V in E]: JoinPath<Path, V, D>;
} : {
    [K in keyof T & string]: T[K] extends readonly (infer E extends string)[] ? {
        [V in E]: JoinPath<JoinPath<Path, K, D>, V, D>;
    } : T[K] extends object ? PathStringMap<T[K] & object, JoinPath<Path, K, D>, D> : T[K] extends string ? {
        [V in T[K]]: JoinPath<JoinPath<Path, K, D>, V, D>;
    } : never;
};
export declare function createPathStrings<const T extends object>(obj: T): PathStringMap<T>;
export declare function createPathStrings<const T extends object, D extends string>(obj: T, delimiter: D): PathStringMap<T, "", D>;
type PathSpec = string | {
    readonly [key: string]: PathSpec;
};
type ResolvePathSpec<T, ID extends number | string> = T extends string ? Record<T, ID> : {
    [K in keyof T]: ResolvePathSpec<T[K], ID>;
};
type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
export type IdRegistryResult<T extends Record<number | string, PathSpec>> = UnionToIntersection<{
    [K in keyof T]: K extends number | string ? ResolvePathSpec<T[K], K> : never;
}[keyof T]>;
/**
 * Converts a mapping of numeric or string keys to path specifications into a
 * nested object structure where each path specification is replaced with the
 * corresponding numeric or string key. This allows to create a global registry
 * of unique keys that can be easily referenced in the code.
 *
 * @param specs A mapping of numeric or string keys to path specifications,
 * where each path specification can be a string or a nested object of strings.
 * @returns A nested object structure where each path specification is replaced
 * with the corresponding numeric or string key.
 */
export declare function createIdRegistry<T extends Record<number | string, PathSpec>>(specs: T): IdRegistryResult<T>;
export {};
