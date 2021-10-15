import { NextPage } from "next";
import React from "react";

interface ButonsProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const Buttons: NextPage<ButonsProps> = ({
  text,
  onClick,
  disabled,
  className,
}) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {text}
    </button>
  );
};
