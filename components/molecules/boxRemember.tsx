import { NextPage } from "next";
import React from "react";
import { CSVLink } from "react-csv";
import { IBoxRememberLeaderBoardData } from "../../types";
import { Images } from "../atoms/images/images";

interface BoxRememberProps {
  leaderboardData: Array<IBoxRememberLeaderBoardData>;
}

const BoxRemember: NextPage<BoxRememberProps> = ({ leaderboardData }) => {
  const csvData =
    leaderboardData.length > 0
      ? leaderboardData
      : [{ address: "0x000...00000", node: "16Uiu...xxxxx" }];

  return (
    <div className="area-remember">
      <div>
        <p>For any issues please reach us on</p>
        <div className="area-links-remember">
          <a
            target="_blank"
            href="https://discord.com/invite/wUSYqpD"
            rel="noopener noreferrer"
          >
            <Images src="/assets/icons/discord.svg" alt="hopr DISCORD" />
            <span>Discord</span>
          </a>

          <a href="//t.me/hoprnet" target="_blank" rel="noreferrer">
            <Images src="/assets/icons/telegram.svg" alt="hopr telegram" />
            <span>Telegram</span>
          </a>
        </div>
      </div>
      {leaderboardData.length > 0 && (
        <p className="download-link">
          <CSVLink filename={"hopr-network.csv"} data={csvData}>
            Download (CSV)
          </CSVLink>
        </p>
      )}
    </div>
  );
};

export default BoxRemember;
