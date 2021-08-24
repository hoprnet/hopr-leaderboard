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
          <span>HOPR Wildorn testnet!</span>{" "}
        </a>
        <br/>
        <br/>
        Wildhorn will run on the Polygon network from the <span>26th August</span> at{" "}
        <span>2pm CEST</span> until{" "}
        <span>2nd September 2pm CEST</span>.{" "} There is series of NFTs for people and high score earners
        based on their HOPR nodes activities. Visit HELP in the menu for instructions.{" "}
        <br/>
        <br/>
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
