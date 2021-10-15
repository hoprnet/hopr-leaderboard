import { NextPage } from "next";
import React, { CSSProperties } from "react";

interface ImagesProps {
  src?: string;
  className?: string;
  alt?: string;
  width?: string;
  onClick?: () => void;
}

export const Images: NextPage<ImagesProps> = ({
  src,
  className,
  alt,
  width,
  onClick,
}) => {
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      width={width}
      onClick={onClick}
    />
  );
};
