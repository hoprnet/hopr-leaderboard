import { constants } from "ethers";
export interface IFirebaseNetworkTables {
  state: string;
  score?: string;
}
export interface IFaucet {
  hopr: number;
  native: number;
  address: string;
}

export interface IResponse {
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

export interface IAccounts {
  id: string;
  openedChannels: string;
  closedChannels: string;
  multiaddr: string;
}

interface INodes {
  id: string | undefined;
  address: string;
  openedChannels: string | number;
  closedChannels: string | number;
}

export interface IState {
  nodes: Array<INodes>;
  address: string;
  refreshed: string;
}

export interface IGetDuneMissingVal {
  hoprAddresses: Array<string>;
  ethAddress: string;
}
