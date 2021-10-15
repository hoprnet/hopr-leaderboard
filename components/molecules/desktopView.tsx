import { NextPage } from "next";
import React from "react";
import { Images } from "../atoms/images/images";
import { Inputs } from "../atoms/inputs/inputs";

interface DesktopViewProps {
  darkMode: boolean;
  activeMenu: boolean;
  onChangeDarkModeDesktop: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
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
          <Inputs
            type="checkbox"
            onChange={(event) => onChangeDarkModeDesktop(event)}
            checked={checked}
          />
          <span className="slider round">
            <Images
              src={`/assets/icons/${darkMode ? "luna.svg" : "dom.svg"}`}
              alt="hopr darkmode"
            />
          </span>
        </label>
      </div>
    </div>
  );
};
