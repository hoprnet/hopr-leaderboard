import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useEthers } from "@usedapp/core";

import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_TYPES,
} from "../../constants/hopr";
import TableRecords from "../molecules/tableRecords";

const getWeb3SignatureEthereumContents = (
  hoprAddress: string,
  ethAddress?: string | null
) => ({
  hoprAddress,
  ethAddress,
});

interface RecordProps {
  account?: string | null;
}

const Records: NextPage<RecordProps> = ({ account }) => {
  const { library } = useEthers();
  const [records, setRecords] = useState<Array<string>>([]);
  const [isPinned, setPinned] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<string>("");

  const loadRecords = async () => {
    const { records, streamId } = await (
      await fetch(`/api/get/${account}`)
    ).json();
    const { isPinned } = await (await fetch(`/api/pin/get/${streamId}`)).json();
    setRecords(records);
    setPinned(isPinned);
    setStreamId(streamId);
  };

  const sendSignatureToAPI = async (
    endpoint: string,
    signature: string,
    message: { hoprAddress: string; ethAddress?: string | null }
  ) => {
    const response = await fetch(endpoint, {
      body: JSON.stringify({ signature, message }),
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
    }).then((res) => res.json());
    return response;
  };

  const pinRecord = async (streamId: string) => {
    await fetch(`/api/pin/${streamId}`);
    await loadRecords();
  };

  const sendSignatureForDeletion = async (
    signature: string,
    message: { hoprAddress: string; ethAddress?: string | null }
  ) => {
    const response = await sendSignatureToAPI(
      `/api/sign/delete/${account}`,
      signature,
      message
    );
    return response;
  };

  const getSignatureAndMessage = async (
    hoprAddress: string,
    ethAddress?: string | null
  ) => {
    const message = getWeb3SignatureEthereumContents(hoprAddress, ethAddress);
    const signature = await library!
      .getSigner()
      ._signTypedData(
        HOPR_WEB3_SIGNATURE_DOMAIN,
        HOPR_WEB3_SIGNATURE_TYPES,
        message
      );
    return { message, signature };
  };

  const deleteRecord = async (
    hoprAddress: string,
    ethAddress?: string | null
  ) => {
    const { signature, message } = await getSignatureAndMessage(
      hoprAddress,
      ethAddress
    );
    await sendSignatureForDeletion(signature, message);
    await loadRecords();
  };

  useEffect(() => {
    account && account.length == 42 && loadRecords();
    return () => {
      setRecords([]);
      setPinned(false);
      setStreamId("");
    };
  }, [account]);

  return account ? (
    <div className="box-container-table records">
      <TableRecords
        isPinned={isPinned}
        records={records}
        pinRecord={() => pinRecord(streamId)}
        library={library}
        account={account}
        deleteRecord={deleteRecord}
      />
    </div>
  ) : (
    <></>
  );
};

export default Records;
