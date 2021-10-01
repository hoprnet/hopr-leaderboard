import { NextPage } from "next";
import React, { CSSProperties, useEffect, useState } from "react";
import { Images } from "../atoms/images";

interface CodeProps {
  code: string[] | string;
  copyCodeToClipboard: (text: string) => void;
  multiline?: boolean;
}

export const Code: NextPage<CodeProps> = ({
  code,
  copyCodeToClipboard,
  multiline,
}) => {
  return (
    <div className="quick-code">
      <div
        //className={`hash ${multiline && "multiline"}`}
        onClick={() => copyCodeToClipboard(code.toString())}
      >
        {multiline ? (
          (code as string[]).map((loc: string, index: number) => <p key={index}>{loc}</p>)
        ) : (
          <p>{code}</p>
        )}
        <div
          /*style={
            multiline && { position: "absolute", right: 0, padding: "0.7em" }
          }*/
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
