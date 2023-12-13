export type Include<T, U> = T extends U ? T : never;

export type Nullable<T = never> = T | null | undefined;
export type ExcludeNullable<T> = T extends Nullable ? never : T;

export function isNotNullable<T>(value: T): value is ExcludeNullable<T> {
  return value !== null && value !== undefined;
}

export function isArray<T>(arg: T): arg is Include<T, readonly any[]> {
  return Array.isArray(arg);
}

export type ArrayOr<T> = T | readonly T[];
export type ArrayOrToArray<T> = T extends readonly any[] ? T : T[];

export function arrayOrToArray<T>(arrayOr: Nullable<ArrayOr<T>>): readonly T[] {
  return isNotNullable(arrayOr) ? (isArray(arrayOr) ? arrayOr : [arrayOr]) : [];
}
