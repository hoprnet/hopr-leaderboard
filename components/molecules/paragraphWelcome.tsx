import { NextPage } from "next";
import React from "react";
import { Images } from "../atoms/images";

interface ParagraphWelcomeProps {}

const ParagraphWelcome: NextPage<ParagraphWelcomeProps> = ({}) => {
  return (
    <p className="paragraph">
      Welcome to <b>HOPR Wildhorn testnet!</b> <br />
      <br />
      Wildhorn will run on the Polygon network from the <b>
        27th August
      </b> at <b>2pm CEST</b> until <b>3rd September 2pm CEST</b>. Earn HOPR
      boost NFTs based on your node activity. Visit HELP in the menu for
      instructions. <br />
      <br />
      <a
        className="aux-link-out"
        target="_blank"
        href="https://medium.com/hoprnet"
        rel="noopener noreferrer"
      >
        Follow us on{" "}
        <b>
          [<Images src="/assets/icons/medium.svg" alt="medium" />] medium.
        </b>
      </a>
    </p>
  );
};

export default ParagraphWelcome;
