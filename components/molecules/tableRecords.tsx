import { NextPage } from "next";
import React from "react";
import { truncate } from "../../utils/string";
import { Buttons } from "../atoms/buttons";
import { Web3Provider } from '@ethersproject/providers'

interface TableRecordsProps {
  isPinned: boolean;
  records: Array<string>;
  pinRecord: () => void;
  library?: Web3Provider;
  account?: string | null;
  deleteRecord: (hoprNode: string, account?: string | null) => void;
}

const TableRecords: NextPage<TableRecordsProps> = ({
  isPinned,
  records,
  pinRecord,
  library,
  account,
  deleteRecord,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th style={{ color: "black" }}>verified nodes</th>
          <th colSpan={2} style={{ color: isPinned ? "green" : "red" }}>
            {isPinned ? (
              "pinned"
            ) : records.length > 0 ? (
              <Buttons text={"pin"} onClick={pinRecord} />
            ) : (
              "no nodes"
            )}
          </th>
        </tr>
        <tr>
          <th scope="col">account</th>
          <th scope="col">node</th>
          {library && <th scope="col">action</th>}
        </tr>
      </thead>
      <tbody>
        {records.map((hoprNode) => {
          return (
            <tr key={hoprNode}>
              <td data-label="account">{truncate(account)}</td>
              <td data-label="node">{truncate(hoprNode)}</td>
              {library && (
                <td data-label="action">
                  <Buttons
                    text={"delete"}
                    onClick={() => deleteRecord(hoprNode, account)}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableRecords;
