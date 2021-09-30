import React, { Dispatch, SetStateAction } from "react";
import { NextPage } from "next";
import { ConnectWallet } from "../molecules/connectWallet";
import { ConnectIDX } from "../molecules/connectIDX";
import { IDX } from "@ceramicstudio/idx";

export interface ConnectorsProps {
  address?: string | null;
  idx?: IDX | null;
  setIdx?:  Dispatch<SetStateAction<IDX | null | undefined>>;
  connectIdx?: boolean;
}

export const Connectors: NextPage<ConnectorsProps> = ({
  address,
  idx,
  setIdx,
  connectIdx,
}) => {
  return (
    <>
      <ConnectWallet>
        {address && connectIdx && (
          <ConnectIDX idx={idx} address={address} setIdx={setIdx} />
        )}
      </ConnectWallet>
    </>
  );
};
