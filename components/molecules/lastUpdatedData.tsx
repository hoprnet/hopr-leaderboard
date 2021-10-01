import { NextPage } from "next";
import React from "react";

interface LastUpdatedDataProps {
  API_LastUpdated: string;
}

const LastUpdatedData: NextPage<LastUpdatedDataProps> = ({
  API_LastUpdated,
}) => {
  return (
    <div className="box-info">
      <p>
        {/* Last Updated: <span>{new Date().toUTCString()}</span> */}
        Last Updated: <span>{API_LastUpdated}</span>
      </p>
    </div>
  );
};

export default LastUpdatedData;
