import React from "react";
import "../../styles/main.scss";

const CopieParagraph = () => {
  return (
    <>
      <p className="paragraph">
        Welcome to {" "}
        <a
          className="aux-link-out-to-post"
          target="_blank"
          href="https://medium.com/hoprnet/bas%C3%B2dino-results-and-v2-announcement-aeff51f155bf"
          rel="noopener noreferrer"
        >
          <span>HOPR Basòdino v2 testnet!</span>{" "}
        </a>
        Basòdino v2 will 
        run from <span>Nov 9th</span> at{" "}
        <span>3pm CET</span> until{" "}
        <span>Nov 23rd</span>.{" "} There is a <span>200,000 HOPR</span> prize pool.{" "}Complete daily tasks for points!{" "} 
        Tasks will be posted on Telegram at 3pm CET each day.{" "} 
        Visit HELP in the menu for instructions.{" "}
        <a
          className="aux-link-out"
          target="_blank"
          href="https://medium.com/hoprnet"
          rel="noopener noreferrer"
        >
          Follow us on{" "}
          <span>
            [<img src="/assets/icons/medium.svg" alt="medium" />] medium.
          </span>
        </a>
      </p>
    </>
  );
};

export default CopieParagraph;
