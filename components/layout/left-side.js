import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "../../styles/main.scss";
import TweetBasodino from "../tweet-basodino";

const LeftSide = ({ darkMode, hash, copyCodeToClipboard }) => {
  const router = useRouter();

  return (
    <section className="area-left-desktop">
      <div className="menu-desktop">
        <Link href="/">
          <div
            className={
              "menu-item-desktop " + (router.pathname == "/" ? "active" : "")
            }
          >
            <img
              src={"/assets/icons/home" + (darkMode ? "_d" : "") + ".svg"}
              alt="hopr HOME"
            />
            <p>Network</p>
          </div>
        </Link>
        <Link href="/nfts">
          <div
            className={
              "menu-item-desktop " +
              (router.pathname == "/nfts" ? "active" : "")
            }
          >
            <img src="/assets/icons/horp_icon.svg" alt="HOPR NFTs" />
            <p>NFTs</p>
          </div>
        </Link>
        <Link href="/node">
          <div
            className={
              "menu-item-desktop " +
              (router.pathname == "/node" ? "active" : "")
            }
          >
            <img src="/assets/icons/magnifying.svg" alt="HOPR node" />
            <p>Node(s)</p>
          </div>
        </Link>
        <Link href="/help">
          <div
            className={
              "menu-item-desktop " +
              (router.pathname == "/help" ? "active" : "")
            }
          >
            <img
              src={"/assets/icons/help" + (darkMode ? "_d" : "") + ".svg"}
              alt="Help"
            />
            <p>Help</p>
          </div>
        </Link>
      </div>
      <div className="copy-line-token">
        <h4>URLs</h4>
      </div>
      <div className="twitter-line-menu">
        <div>
          <a href="https://stake.hoprnet.org" target="_blank">
            <img src="/assets/icons/horp_icon.svg" width="18px" alt="hopr" />
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
    </section>
  );
};

export default LeftSide;
