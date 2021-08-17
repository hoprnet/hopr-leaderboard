export const ENDPOINT = 'https://api.thegraph.com/subgraphs/name/hoprnet/hopr-channels-polygon'
export const QUERY_GET_ACCOUNTS = `
  {
    accounts(first: 100) {
      id
      multiaddr
      channels {
        id
      }
      hasAnnounced
    }
  }
`