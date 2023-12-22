export function excludeField<T, K extends keyof T>(
  object: T,
  keys: K[],
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([key]: string[]) => !keys.includes(key as K),
    ),
  ) as Omit<T, K>;
}
