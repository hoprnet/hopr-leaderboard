import { NextPage } from "next";
import React, { useState } from "react";
import { INodeTableTX, IResponse } from "../../types";
import { truncate } from "../../utils/string";
import { Buttons } from "../atoms/button/buttons";
import { Images } from "../atoms/images/images";

interface NodeTableProps {
  nodes: { [key: string]: string };
  signRequest: (node: string, nodes: string) => Promise<IResponse>;
  copyCodeToClipboard: (text: string) => void;
}

const NodeTable: NextPage<NodeTableProps> = ({
  nodes,
  signRequest,
  copyCodeToClipboard,
}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [serverResponse, setServerResponse] = useState<string>("");
  const [transactions, setTransactions] = useState<Array<INodeTableTX>>([]);

  const onClick = async (node: string, nodes: { [key: string]: string }) => {
    setTransactions([]);
    setServerResponse("");
    setLoading(true);
    try {
      const response = (await signRequest(node, nodes[node])) || {};
      if (response.status == "ok") {
        setTransactions(response.transactions);
      }
      setServerResponse(response.message);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div className="container-table-records node-table">
      <table>
        <thead>
          <tr>
            <th>HOPR node</th>
            <th>Ethereum address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(nodes).map((node: string) => (
            <tr key={node}>
              <td onClick={() => copyCodeToClipboard(node)}>
                {truncate(node)}
                <Images src="/assets/icons/copy.svg" alt="copy" className="img-copy"/>
              </td>
              <td onClick={() => copyCodeToClipboard(nodes[node])}>
                {truncate(nodes[node])}
                <Images src="/assets/icons/copy.svg" alt="copy" className="img-copy"/>
              </td>
              <td>
                <Buttons
                  disabled={isLoading}
                  onClick={() => onClick(node, nodes)}
                  text={isLoading ? "Loading.." : "Fund"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {serverResponse.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>transaction</th>
              <th>quantity</th>
              <th>symbol</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <th colSpan={3}>{serverResponse}</th>
            </tr>
            {transactions.map((tx: INodeTableTX, index: number) => (
              <tr>
                <td onClick={() => copyCodeToClipboard(tx.hash)}>
                  {truncate(tx.hash)}
                  <Images src="/assets/icons/copy.svg" alt="copy" />
                </td>
                <td>{index == 0 ? "10" : "0.01"}</td>
                <td>{index == 0 ? "mHOPR" : "MATIC"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NodeTable;