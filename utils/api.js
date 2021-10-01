import { createClient } from '@urql/core';
import db, { FirebaseNetworkTables } from "./db";
import { DEDUCTABLE_SCORE_MAP, getImportanceScore } from "../constants/score";
import { DAILIES_SCORE_ARRAY } from "../constants/dailies";
import { Multiaddr } from 'multiaddr'
import { stringToU8a } from './string'
import { HOPR_NETWORK } from "./env";
import { utils } from 'ethers'
import { ENDPOINT, QUERY_GET_ACCOUNTS } from '../constants/queries';

export async function getData(table) {
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
  const client = createClient({
    url: ENDPOINT,
    fetchOptions: {
      mode: "cors", // no-cors, cors, *same-origin
    },
  });
  const { data } = await client.query(QUERY_GET_ACCOUNTS).toPromise()
  return data && data.accounts;
}

export async function getAllData() {
  const accounts = await getAllAccounts() || []
  const [state] = await Promise.all([
    getData(FirebaseNetworkTables.state).then((res) => res.data),
  ]);

  const nodes = accounts.map((account) => {
    const {id, fromChannelsCount, fromChannels, multiaddr, balance} = account
    const address = multiaddr.length > 0 ? new Multiaddr(stringToU8a(multiaddr[0])).toString().split('/').pop() : ''
    return {
    id: address,
    address: id,
    balance,
    importanceScore: getImportanceScore(account),
    fromChannelsCount,
    openedChannels: fromChannels.filter(c => c.status === 'OPEN').length,
    closedChannels: fromChannels.filter(c => c.status === 'CLOSED').length,
   }
})

  state.nodes = nodes;

  return {
    data: state,
  };
}

export default { getState, getScore, getAllData };
