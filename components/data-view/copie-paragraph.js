import React from "react";

const CopieParagraph = () => {
  return (
    <>
      <p className="paragraph">
        Welcome to {" "}
          <span>HOPR Wildhorn testnet!</span>{" "}
        <br/>
        <br/>
        Wildhorn will run on the Polygon network from the <span>27th August</span> at{" "}
        <span>2pm CEST</span> until{" "}
        <span>3rd September 2pm CEST</span>.{" "} Earn HOPR boost NFTs based on your node activity. Visit HELP in the menu for instructions.{" "}
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
