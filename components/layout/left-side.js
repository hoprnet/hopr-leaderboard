import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "../../styles/main.scss";
import TweetBasodino from "../tweet-basodino";

const LeftSide = ({darkMode,hash, copyCodeToClipboard}) => {
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
            <img src={'/assets/icons/home'+ (darkMode ? '_d':'') +'.svg'} alt="hopr HOME" />
            <p>HOME</p>
          </div>
        </Link>
        <Link href="/hopr-allocation">
          <div
            className={
              "menu-item-desktop " +
              (router.pathname == "/hopr-allocation" ? "active" : "")
            }
          >
            <img src="/assets/icons/horp_icon.svg" alt="hopr HOPR ALLOCATION" />
            <p>
              HOPR <br /> ALLOCATION
            </p>
          </div>
        </Link>
        <div className="menu-item-desktop ">
          <a
            target="_blank"
            href="https://discord.com/invite/wUSYqpD"
            rel="noopener noreferrer"
          >
            <img src={'/assets/icons/discord'+ (darkMode ? '_d':'') +'.svg'} alt="hopr HOME" />
            <p>DISCORD</p>
          </a>
        </div>
        <Link href="/help">
          <div
            className={
              "menu-item-desktop " +
              (router.pathname == "/help" ? "active" : "")
            }
          >
              <img src={'/assets/icons/help'+ (darkMode ? '_d':'') +'.svg'} alt="hopr HOME" />
            <p>HELP</p>
          </div>
        </Link>
      </div>
      <div className="copy-line-token">
        <h4>HOPR node</h4>
        <div className="hash" onClick={() => copyCodeToClipboard(hash)}>
          <p>{hash.substr(-8)}</p>
          <div>
            <img style={{ marginLeft: 8 }} src="/assets/icons/copy.svg" alt="copy" />
          </div>
        </div>
      </div>
      <div className="twitter-line-menu">
        <div>
          <a href="https://twitter.com/hoprnet" target="_blank">
            <img src="/assets/icons/twitter.svg" alt="twitter" />
            <p>@hoprnet</p>
          </a>
        </div>
        <div>
          <TweetBasodino>
            <img src="/assets/icons/twitter.svg" alt="twitter" />
            <p>#Basodino</p>
          </TweetBasodino>
        </div>
      </div>
    </section>
  );
};

export default LeftSide;
