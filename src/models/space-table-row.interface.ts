import type { TableRowInterface } from "@/models/table-row.interface";

interface SpaceTableData {
  name: string;
  dataChange: number;
  size: number;
}

export interface SpaceTableRowInterface
  extends TableRowInterface<SpaceTableData> {}
