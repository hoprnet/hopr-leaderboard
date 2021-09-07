import React from "react";
import CopieParagraph from "../data-view/copie-paragraph";
import DataBoxCloud from "../data-view/data-box-cloud";
import DataUpdateKnow from "../data-view/data-update-know";

const RightSide = ({ address, channel, API_LastUpdated, copyCodeToClipboard }) => {
  return (
    <section className="right-side only-desktop-view">
      <CopieParagraph />
      <hr />
      <DataBoxCloud address={address} channel={channel} copyCodeToClipboard={copyCodeToClipboard}/>
      <hr />
      <DataUpdateKnow API_LastUpdated={API_LastUpdated} />
    </section>
  );
};

export default RightSide;
