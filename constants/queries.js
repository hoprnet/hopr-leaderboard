export const ENDPOINT =
  "https://api.thegraph.com/subgraphs/id/QmTZF2p7zUVQC9g2vdtnrqm3rNPjhMzeR1hrw9sw7Zawpr"; // change to staging URL for development
export const QUERY_GET_ACCOUNTS = `
  {
    accounts(first: 250, orderBy: fromChannelsCount, orderDirection: desc) {
      id
      multiaddr
      publicKey
      balance
      fromChannelsCount
      toChannelsCount
      fromChannels {
        id
        destination {
          id
          balance
        }
        status
        balance
      }
      hasAnnounced
    }
  }
`;

export const QUERY_GET_ACCOUNT = `
query ($id: String!) {
  accounts(first: 1, where: {id: $id}, orderBy: openedChannels, orderDirection: desc) {
    id
    multiaddr
    publicKey
    balance
    fromChannelsCount
    toChannelsCount
    fromChannels {
      id
      destination {
        id
        balance
      }
      status
      balance
    }
    hasAnnounced
  }
}
`;
