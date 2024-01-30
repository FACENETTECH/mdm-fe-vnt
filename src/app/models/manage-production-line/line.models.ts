export interface Line {
  productionLineId: number;
  productionLineCode: string;
  productionLineName: string;
  productionLineType: string;
  productionRate: number;
  description: string;
  vendor: string;
  maintenanceTime: number;
  minProductionQuantity: number;
  maxProductionQuantity: number;
  buyDate: string;
  maxWaitingTime: number;
  status: string;
  cycleTime: number;
  isActive: any;
  [key: string]: any;
}

export interface Column {
  id: number,
  title: string,
  key: string,
  width: string,
  check: boolean;
}
