import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { Images } from "../images/images";

export interface ElementMenuMobileProps {
  href: string;
  className: string;
  src: string;
  alt: string;
  p: string;
}

export const ElementMenuMobile: NextPage<ElementMenuMobileProps> = ({ href, className, src, alt, p }) => {
  return(
    <Link href={href}>
      <li className={className}>
        <Images src={src} alt={alt}/>
        <p>{p}</p>
      </li>
    </Link>
  )
}

