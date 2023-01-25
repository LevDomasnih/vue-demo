export interface TableColumnsInterface {
  title: string;
  key: string;
  render?: (value: string | number) => string;
}
