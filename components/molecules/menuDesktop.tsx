import { NextPage } from "next";
import React from "react";
import { MenuSectionsDesktop } from "../../constants/menuSections";
import { IeMenuDesktop } from "../../types";
import { ElementMenuDesktop } from "../atoms/elementMenuDesktop";

export interface MenuDesktopdProps {
  darkMode: boolean;
}

export const MenuDesktop: NextPage<MenuDesktopdProps> = ({ darkMode }) => {
  const sections = MenuSectionsDesktop(darkMode);
  return (
    <div className="only-desktop-view">
      <section className="area-left-desktop">
        <div className="menu-desktop">
          {sections.map((e: IeMenuDesktop, index: number) => (
            <ElementMenuDesktop {...e} key={index} />
          ))}
        </div>
      </section>
    </div>
  );
};
