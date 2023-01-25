export interface TableRowInterface<T = { [key: string]: any }> {
  key: string | number;
  active?: boolean;
  isError?: boolean;
  data: T;
}
