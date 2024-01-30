export interface Machine {
  machineCode: string;
  machineName: string;
  machineType: string;
  productionRate: number;
  machineDescription: string;
  status: string;
  vendor: string;
  maintanceTime: string;
  minProductionQuantity: number;
  maxroductionQuantity: number;
  buyDate: string;
  maxWaitingTime: string;
  cycleTime: string;
  [key: string]: any;
}

export interface Column {
  id: number,
  title: string,
  key: string,
  width: string,
  check: boolean;
}
