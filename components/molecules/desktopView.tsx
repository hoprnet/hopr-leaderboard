import { NextPage } from "next";
import React from "react";
import { Images } from "../atoms/images";

export interface DesktopViewProps {
  darkMode: boolean;
  activeMenu: boolean;
  onChangeDarkModeDesktop: (event: React.ChangeEvent) => void;
  checked: boolean
}

export const DesktopView: NextPage<DesktopViewProps> = ({
  darkMode,
  activeMenu,
  onChangeDarkModeDesktop,
  checked,
}) => {
  return (
    <div className="only-desktop-view">
      <div className="icon-logo-desktop">
        <a
          href="https://hoprnet.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Images
            src={`/assets/brand/${darkMode ? "logo_white.svg" : "logo.svg"}`}
            className={activeMenu ? "open" : ""}
            alt="hopr"
          />
        </a>
      </div>

      <div className="active-darkmode">
        <label className="switch">
          <input
            type="checkbox"
            onChange={(event) => onChangeDarkModeDesktop(event)}
            checked={checked}
          />
          <span className="slider round">
            <Images
              className="icon-darkmode"
              src={`/assets/icons/${darkMode ? "luna.svg" : "dom.svg"}`}
              alt="hopr darkmode"
            />
          </span>
        </label>
      </div>
    </div>
  );
};
