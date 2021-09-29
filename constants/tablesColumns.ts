
export const columnsDefaults: {
  title: string;
  dataIndex: string;
  key: string;
  className: string;
}[] = [
  {
    title: "opened channels",
    dataIndex: "openedChannels",
    key: "openedChannels",
    className: "sortBy desc",
  },
  {
    title: "closed channels",
    dataIndex: "closedChannels",
    key: "closedChannels",
    className: "sortBy desc",
  },
  {
    title: "address",
    dataIndex: "address",
    key: "address",
    className: "sortBy",
  },
  {
    title: "id",
    dataIndex: "id",
    key: "id",
    className: "sortBy",
  },
];
