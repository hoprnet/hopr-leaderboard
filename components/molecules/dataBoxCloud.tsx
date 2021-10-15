import { NextPage } from "next";
import React from "react";
import { Images } from "../atoms/images/images";

interface DataBoxCloudProps {
  address: string;
  channel: string;
  copyCodeToClipboard: (text: string) => void;
}

const DataBoxCloud: NextPage<DataBoxCloudProps> = ({
  address,
  channel,
  copyCodeToClipboard,
}) => {
  return (
    <div className="box-border">
      <div onClick={() => copyCodeToClipboard(address)}>
        <h3> {address} </h3>
        <p>
          <Images src="/assets/icons/copy.svg" alt="copy" /> HOPR token address
        </p>
      </div>
      <div onClick={() => copyCodeToClipboard(channel)}>
        <h3> {channel} </h3>
        <p>
          <Images src="/assets/icons/copy.svg" alt="copy" /> HOPR payment
          channel
        </p>
      </div>
    </div>
  );
};

export default DataBoxCloud;
