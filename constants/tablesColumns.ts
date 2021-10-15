import { IColumnsDefaults } from "../types";



export const columnsDefaults: IColumnsDefaults[] = [
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
