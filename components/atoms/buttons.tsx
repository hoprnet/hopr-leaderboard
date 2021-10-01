import { NextPage } from "next";
import React, { CSSProperties } from "react";

interface ButonsProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  style?: CSSProperties
}

export const Buttons: NextPage<ButonsProps> = ({ text, onClick, disabled, style }) => {
  return <button onClick={onClick} disabled={disabled} style={style}>{text}</button>;
};
