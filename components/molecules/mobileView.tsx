import { NextPage } from "next";
import React from "react";
import { Images } from "../atoms/images/images";

interface MobileViewProps {
  darkMode: boolean;
  activeMenu: boolean;
  onClick: () => void;
}

export const MobileView: NextPage<MobileViewProps> = ({
  darkMode,
  activeMenu,
  onClick,
}) => {
  return (
    <nav className="navbar only-mobile-view">
      <div className="icon-logo-navbar">
        <Images
          src={`/assets/brand/${darkMode ? "logo_white.svg" : "logo.svg"}`}
          className={activeMenu ? "open" : ""}
          alt="hopr"
        />
      </div>

      <div
        className={`icon-menu-navbar ${activeMenu ? "open" : ""}`}
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
