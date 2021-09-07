import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import TweetBasodino from "../tweet-basodino";

const Menu = ({
  darkMode,
  changeThemeMode,
  activaMenu,
  hash,
  copyCodeToClipboard,
}) => {
  const router = useRouter();
  return (
    <>
      <div className={"menu-mobile " + (activaMenu ? "open-menu" : "")}>
        <div className="menu-container">
          <div>
            <ul>
              <Link href="/">
                <li className={router.pathname == "/" ? "active" : ""}>
                  <img src="/assets/icons/home.svg" alt="HOPR network" />
                  <p>Network</p>
                </li>
              </Link>
              <Link href="/nfts">
                <li className={router.pathname == "/nfts" ? "active" : ""}>
                  <img src="/assets/icons/horp_icon.svg" alt="HOPR NFTs" />
                  <p>NFTs</p>
                </li>
              </Link>
              <Link href="/node">
                <li>
                  <img src="/assets/icons/magnifying.svg" alt="HOPR node" />
                  <p>Node</p>
                </li>
              </Link>
              <Link href="/help">
                <li className={router.pathname == "/help" ? "active" : ""}>
                  <img src="/assets/icons/help.svg" alt="Help" />
                  <p>Help</p>
                </li>
              </Link>
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
                <div>
                  <img
                    style={{ marginLeft: 8 }}
                    src="/assets/icons/copy.svg"
                    alt="copy"
                  />
                </div>
              </div>
            </div>
            <hr />
            <div className="line-darkMode-mobile">
              <p>Light on dark</p>
              <label className="switch">
                <input type="checkbox" onChange={() => changeThemeMode()} />
                <span className="slider round">
                  <img
                    className="icon-darkmode"
                    src={"/assets/icons/" + (darkMode ? "luna.svg" : "dom.svg")}
                    alt="hopr"
                  />
                </span>
              </label>
            </div>
            <hr />
            <div className="twitter-line-menu">
              <div>
                <a href="https://stake.hoprnet.org" target="_blank">
                  <img
                    src="/assets/icons/horp_icon.svg"
                    width="18px"
                    alt="hopr"
                  />
                  <p>Stake HOPR</p>
                </a>
              </div>
              <div>
                <a href="https://twitter.com/hoprnet" target="_blank">
                  <img src="/assets/icons/twitter.svg" alt="twitter" />
                  <p>Get updates</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
