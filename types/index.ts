import { Dispatch, SetStateAction } from "react";

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
  transactions: Array<INodeTableTX>;
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

export interface INodeTableTX {
  hash: string;
}

export interface IVerifyNodeProfile {
  "hopr-wildhorn": { [key: string]: string };
}

export interface INodeObject {
  id: string;
  tweetUrl: string;
}
export interface ISortedUsername {
  id: string;
  username: string;
  openedChannels?: number;
}

export interface IDataIndex {
  nodes: Array<string> | INodeObject;
}

export interface IBoxRememberLeaderBoardData {
  id: string;
  username: string;
}

export interface IColumnsDefaults {
  title: string;
  dataIndex: string;
  key: string;
  className: string;
}

export interface IReduceStream {
  streamId: string;
  ethAddress: string;
}

export interface IReduceAll {
  currentLength: number;
  length: number;
}

export interface ISQLAll {
  ethAddress: string;
  hoprAddresses: string
}
