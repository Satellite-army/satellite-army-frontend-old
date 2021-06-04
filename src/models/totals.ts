export interface TotalItem {
  key: string;
  marketSize: number;
  borrowed: number;
  name: string;
}

export interface Totals {
  marketSize: number;
  borrowed: number;
  lentOutPct: number;
  items: TotalItem[];
}

export interface SatelliteTotals {
  networth: number;
  totaldebt: number;
  totaldeposit: number;
  totalyield: number;
}

