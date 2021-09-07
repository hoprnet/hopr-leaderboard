import React from "react";

const MsgCopy = ({ showMsg }) => {
  return (
    <div className={"box-alert-copy " + (showMsg ? "showAlert" : "")}>
      <div className="container-alert">
        <p>copied to clipboard</p>
      </div>
    </div>
  );
};

export default MsgCopy;
