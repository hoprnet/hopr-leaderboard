import db, { FirebaseNetworkTables } from "./db";
import { ENDPOINT, HOPR_NETWORK } from "./env";
import { Client, createClient } from "@urql/core";
import { QUERY_GET_ACCOUNTS } from "../constants/querys";
import { Multiaddr } from 'multiaddr'
import { stringToU8a } from './string'

export async function getData(table: any) {
  try {
    const queryResponse = await db.getTable(HOPR_NETWORK, table);
    if (queryResponse.data) {
      return { data: queryResponse.data, status: 200 };
    } else {
      return { data: null, status: 500 };
    }
  } catch (e) {
    return { data: null, status: 500 };
  }
}

export async function getState() {
  return getData(FirebaseNetworkTables.state);
}

export async function getScore() {
  return getData(FirebaseNetworkTables.score);
}

export async function getAllAccounts() {
  const client: Client = createClient({
    url: ENDPOINT,
    fetchOptions: {
      mode: "cors", // no-cors, cors, *same-origin
    },
  });
  const { data } = await client.query(QUERY_GET_ACCOUNTS).toPromise();
  return data && data.accounts;
}

export async function getAllData() {
  const accounts: any = (await getAllAccounts()) || [];
  const [state]: any = await Promise.all([
    getData(FirebaseNetworkTables.state).then((res) => res.data),
  ]);

  const nodes = accounts.map(
    ({ id, openedChannels, closedChannels, multiaddr }: any) => {
      const address: string | undefined = multiaddr
        ? new Multiaddr(stringToU8a(multiaddr)).toString().split("/").pop()
        : "";
      return {
        id: address,
        address: id,
        openedChannels: address!.length > 0 ? openedChannels : -1,
        closedChannels: address!.length > 0 ? closedChannels : -1,
      };
    }
  );

  state.nodes = nodes;

  return {
    data: state,
  };
}

export default { getState, getScore, getAllData };