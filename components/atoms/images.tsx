import { NextPage } from "next";
import React, { CSSProperties } from "react";

interface ImagesProps {
  src?: string;
  className?: string;
  alt?: string;
  style?: CSSProperties;
  width?: string;
  onClick?: () => void;
}

export const Images: NextPage<ImagesProps> = ({
  src,
  className,
  alt,
  style,
  width,
  onClick,
}) => {
  return (
    <img
      src={src}
      className={className}
      alt={alt}
      style={style}
      width={width}
      onClick={onClick}
    />
  );
};
