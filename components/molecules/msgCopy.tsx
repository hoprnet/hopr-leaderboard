import { NextPage } from "next";
import React from "react";

interface MsgCopyProps {
  showMsg: boolean;
}

const MsgCopy: NextPage<MsgCopyProps> = ({ showMsg }) => {
  return (
    <div className={"box-alert-copy " + (showMsg ? "showAlert" : "")}>
      <div className="container-alert">
        <p>copied to clipboard</p>
      </div>
    </div>
  );
};

export default MsgCopy;
