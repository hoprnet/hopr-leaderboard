export const ENDPOINT = 'https://api.thegraph.com/subgraphs/id/QmVZEbeZ65zkEw99om64U5tuosYRhQG3uqBYZDkvGrXfMs'
export const QUERY_GET_ACCOUNTS = `
  {
    accounts(first: 100, orderBy: openedChannels, orderDirection: desc) {
      id
      multiaddr
      openedChannels
      closedChannels
      hasAnnounced
    }
  }
`