import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { Images } from "./images";

interface ElementMenuDesktopProps {
  href: string;
  className: string;
  src: string;
  alt: string;
  p: string;
}

export const ElementMenuDesktop: NextPage<ElementMenuDesktopProps> = ({ href, className, src, alt, p }) => {
  return (
    <Link href={href}>
      <div className={className}>
        <Images src={src} alt={alt} />
        <p>{p}</p>
      </div>
    </Link>
  );
};
