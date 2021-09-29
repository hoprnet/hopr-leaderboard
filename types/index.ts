import { constants } from "ethers";
export interface IFirebaseNetworkTables {
  state: any;
  score?: any;
}

export interface IVisibleData {
  visible: boolean;
  position: { x: number; y: number };
  os_page: object;
  data: string;
}

export interface IFaucet {
  hopr: number;
  native: number;
  address: string;
}

export interface IResponse{
  status: string;
  transactions: any;
  message: string;
  streamId: string;
}

export interface IeMenuDesktop {
  href: string;
  className: string;
  src: string;
  alt: string;
  p: string;
}

export interface IeMenuMobile {
  href: string;
  target: string;
  src: string;
  width: string;
  alt: string;
  p: string;
}


