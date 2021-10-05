import { NextPage } from "next";
import React, { CSSProperties } from "react";

interface ButonsProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  style?: CSSProperties
  className?: string;
}

export const Buttons: NextPage<ButonsProps> = ({ text, onClick, disabled, style, className }) => {
  return <button onClick={onClick} disabled={disabled} style={style} className={className}>{text}</button>;
};
