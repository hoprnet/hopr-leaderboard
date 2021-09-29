import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Images } from "../atoms/images";

interface CodeProps {
  code: any;
  copyCodeToClipboard: (text: string) => void;
  multiline?: any;
}

export const Code: NextPage<CodeProps> = ({
  code,
  copyCodeToClipboard,
  multiline,
}) => {
  return (
    <div className="quick-code">
      <div
        className={`hash ${multiline && "multiline"}`}
        onClick={() => copyCodeToClipboard(code)}
      >
        {multiline ? (
          code.map((loc: string, index: string) => <p key={index}>{loc}</p>)
        ) : (
          <p>{code}</p>
        )}
        <div
          style={
            multiline && { position: "absolute", right: 0, padding: "0.7em" }
          }
        >
          <Images
            style={{ marginLeft: 8 }}
            src="/assets/icons/copy.svg"
            alt="copy"
          />
        </div>
      </div>
    </div>
  );
};
