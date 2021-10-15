import { NextPage } from "next";
import React from "react";

interface MsgCopyProps {
  showMsg: boolean;
}

const MsgCopy: NextPage<MsgCopyProps> = ({ showMsg }) => {
  return (
    <div className={`box-alert-copy ${showMsg ? "showAlert" : ""}`}>
      <p>copied to clipboard</p>
    </div>
  );
};

export default MsgCopy;
