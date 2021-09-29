import { NextPage } from "next";
import React from "react";
import { Images } from "../atoms/images";

export interface MobileViewProps {
  darkMode: boolean;
  activeMenu: boolean;
  onClick: () => void;
}

export const MobileView: NextPage<MobileViewProps> = ({ darkMode, activeMenu, onClick }) => {
  return (
    <nav className="navbar only-mobile-view">
      <div className="icon-logo">
        <Images
            src={`/assets/brand/${darkMode ? "logo_white.svg" : "logo.svg"}`}
            className={activeMenu ? "open" : ""}
            alt="hopr"
          />
      </div>

      <div
        className={"icon-menu " + (activeMenu ? "open" : "")}
        onClick={() => onClick()}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
};
