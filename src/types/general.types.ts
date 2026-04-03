export type ReplaceKey<T, K extends keyof T, NewType> = Omit<T, K> & { [P in K]: NewType };

export type TransformProperties<T, From, To> = {
  [K in keyof T]: T[K] extends From ? To : T[K];
};