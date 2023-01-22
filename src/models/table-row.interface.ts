export interface TableRowInterface {
  key: string;
  active?: boolean;
  data: {
    [key: string]: string | number;
  };
}
