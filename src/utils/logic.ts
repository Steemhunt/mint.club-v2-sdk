export function isFalse(value: unknown): value is null | undefined {
  // if value exists, it is not false. for example 0 is handled as false, but it is not false
  // even empty string is a string, not false
  return typeof value === 'undefined' || value === undefined || value === null;
}

export function isTrue<T>(value: T | null | boolean | undefined): value is T {
  return value === true || (value !== undefined && value !== null);
}
