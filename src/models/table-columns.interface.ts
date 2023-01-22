export interface TableColumnsInterface {
  title: string;
  key: string;
  sortedByASC?: boolean;
  render?: (value: string | number) => string;
}
