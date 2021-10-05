import React from "react";
import { MenuSectionsMobile, Networks } from "../../constants/menuSections";
import { Images } from "../atoms/images";
import { ElementMenuMobile, ElementMenuMobileProps } from "../atoms/elementMenuMobile";
import { NextPage } from "next";
import { IeMenuMobile } from "../../types";

interface MenuMobileProps {
  activeMenu: boolean;
  hash: string;
  copyCodeToClipboard: (hash: string) => void;
  changeThemeMode: () => void;
  darkMode: boolean;
}

export const MenuMobile: NextPage<MenuMobileProps> = ({
  activeMenu,
  hash,
  copyCodeToClipboard,
  changeThemeMode,
  darkMode,
}) => {
  const sections = MenuSectionsMobile();
  return (
    <div className={`menu-mobile ${activeMenu ? "open-menu" : ""}`}>
      <div className="menu-container">
        <ul>
          {sections.map((e: ElementMenuMobileProps, index: number) => (
            <ElementMenuMobile {...e} key={index} />
          ))}
        </ul>
        <hr />

        <div className="quick-code">
          <p>HOPR node</p>
          <div className="hash" onClick={() => copyCodeToClipboard(hash)}>
            <p>
              {hash.slice(0, 8)}
              <span>...</span>
              {hash.slice(-8)}
            </p>
            <Images
              className="img-copy"
              src="/assets/icons/copy.svg"
              alt="copy"
            />
          </div>
        </div>
        <hr />
        <div className="line-darkMode-mobile">
          <p>Light on dark</p>
          <label className="switch">
            <input type="checkbox" onChange={() => changeThemeMode()} />
            <span className="slider round">
              <Images
                src={`/assets/icons/${darkMode ? "luna.svg" : "dom.svg"}`}
                alt="hopr darkmode"
                className="icon-darkmode"
              />
            </span>
          </label>
        </div>
        <hr />
        <div className="twitter-line-menu">
          {Networks.map((e: IeMenuMobile, index: number) => (
            <div key={index}>
              <a href={e.href} target={e.target}>
                <Images src={e.src} width={e.width} alt={e.alt} />
                <p>{e.p}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
