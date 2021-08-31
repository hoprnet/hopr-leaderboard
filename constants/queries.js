export const ENDPOINT = 'https://api.thegraph.com/subgraphs/name/hoprnet/hopr-channels-polygon'
export const QUERY_GET_ACCOUNTS = `
  {
    accounts(first: 1000, orderBy: openedChannels, orderDirection: desc) {
      id
      multiaddr
      openedChannels
      closedChannels
      hasAnnounced
    }
  }
`