export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/** check for property existence in data object */
export const hasProperty = (data: unknown, property: string) => {
  return data instanceof Object && property in data;
};