import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import api from "../../utils/api";
import { MobileView } from "../molecules/mobileView";
import { DesktopView } from "../molecules/desktopView";
import MsgCopy from "../molecules/msgCopy";
import { MenuMobile } from "../molecules/menuMobile";
import { MenuDesktop } from "../molecules/menuDesktop";
import ParagraphWelcome from "../molecules/paragraphWelcome";
import DataBoxCloud from "../molecules/dataBoxCloud";
import LastUpdatedData from "../molecules/lastUpdatedData";
import { NextPage } from "next";
import DataBoxTable from "../molecules/dataBoxTable";

export interface LayoutProps {
  toggle?: boolean;
}

const Layout: NextPage<LayoutProps> = ({ toggle, children }) => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showMsg, setShowMsg] = useState<boolean>(false);
  const [activeMenu, setactiveMenu] = useState<boolean>(false);
  const [API_LastUpdated, SetAPI_LastUpdated] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
  const [hash, setHash] = useState<string>("");

  const copyCodeToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    showCopyCode();
  };

  const showCopyCode = () => {
    setShowMsg(true);
    setTimeout(() => {
      setShowMsg(false);
    }, 800);
  };

  const changeThemeMode = () => {
    if (darkMode !== undefined) {
      if (darkMode) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    }
  };

  useEffect(() => {
    if (toggle) {
      showCopyCode();
    }
  }, [toggle]);

  useEffect(() => {
    if (darkMode !== undefined) {
      localStorage.setItem("darkMode", darkMode.toString());
      changeThemeMode();
    }
  }, [darkMode]);

  const fetchData = async () => {
    const response = await api.getAllData();
    if (response.data) {
      let CleanDate = response.data.refreshed.slice(0, -5);
      SetAPI_LastUpdated(CleanDate);
      setAddress("0x6f80d1a3ab9006548c2fbb180879b87364d63bf7");
      setChannel("0x3Cd4B4D97dCad4eE772BC4f0fB0e7605fC86A85b");
      setHash(response.data.address);
    }
  };

  useEffect(() => {
    fetchData();
    let oValue = localStorage.getItem("darkMode");
    if (oValue) {
      setDarkMode(oValue === "true");
    }
  }, []);

  const onClickMenuMobile = () => {
    setactiveMenu(!activeMenu);
  };

  const onChangeDarkModeDesktop = (event: any) => {
    setDarkMode(event.target.checked);
  };

  return (
    <>
      <Head>
        <title>hopr</title>
      </Head>

      <header>
        <MobileView
          darkMode={darkMode}
          activeMenu={activeMenu}
          onClick={() => onClickMenuMobile()}
        />

        <DesktopView
          darkMode={darkMode}
          activeMenu={activeMenu}
          onChangeDarkModeDesktop={(event: any) =>
            onChangeDarkModeDesktop(event)
          }
          checked={darkMode ? true : false}
        />

        <MsgCopy showMsg={showMsg} />
      </header>

      <MenuMobile
        activeMenu={activeMenu}
        hash={hash}
        copyCodeToClipboard={copyCodeToClipboard}
        changeThemeMode={changeThemeMode}
        darkMode={darkMode}
      />

      <div className="main-container">
        <MenuDesktop darkMode={darkMode} />
        <section
          className={
            "about only-mobile-view " +
            (router.pathname != "/" ? "aux-margin" : "")
          }
        >
          <div className={router.pathname != "/" ? "only-desktop-view" : ""}>
            <ParagraphWelcome />
          </div>
        </section>

        <div className="only-mobile-view">
          <DataBoxTable
            nodesVerified={"?"}
            nodesRegistered={"?"}
            nodesConnected={"?"}
          />
        </div>
        
        {children}

        <section className="only-mobile-view">
          <hr />
          <DataBoxCloud
            address={address}
            channel={channel}
            copyCodeToClipboard={copyCodeToClipboard}
          />
          <hr />

          <LastUpdatedData API_LastUpdated={API_LastUpdated} />

          <hr />
          <p className="paragraph-copy ">
            Thanks for helping us create the <span> HOPR network. </span>
          </p>
        </section>

        <section className="right-side only-desktop-view">
          <ParagraphWelcome />
          <hr />
          <DataBoxCloud
            address={address}
            channel={channel}
            copyCodeToClipboard={copyCodeToClipboard}
          />
          <hr />
          <LastUpdatedData API_LastUpdated={API_LastUpdated} />
        </section>
      </div>
    </>
  );
};

export default Layout;
