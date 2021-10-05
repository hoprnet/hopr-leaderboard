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
        className={`hash ${multiline && "multiline"}`}
        onClick={() => copyCodeToClipboard(code.toString())}
      >
        {multiline ? (
          (code as string[]).map((loc: string, index: number) => (
            <p key={index}>{loc}</p>
          ))
        ) : (
          <p>{code}</p>
        )}
        <div>
          <Images
            className="img-copy"
            src="/assets/icons/copy.svg"
            alt="copy"
          />
        </div>
      </div>
    </div>
  );
};
