import React from "react";
import "../../styles/main.scss";

const DataBoxCloud = ({address, channel, copyCodeToClipboard}) => {
  return (
    <div className="box-border ">
      <div onClick={() => copyCodeToClipboard(address)}>
        <h3 className="num"> {address} </h3>
        <p><img src="/assets/icons/copy.svg" alt="copy" /> HOPR token address</p>
      </div>
      <div onClick={() => copyCodeToClipboard(channel)}>
        <h3 className="num"> {channel} </h3>
        <p><img src="/assets/icons/copy.svg" alt="copy" /> HOPR payment channel</p>
      </div>
    </div>
  );
};

export default DataBoxCloud;
