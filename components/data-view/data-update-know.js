import React from "react";

const DataUpdateKnow = ({API_LastUpdated}) => {
  
  return (
    <div className="box-info">
      <div>
        <p>
          Last Updated: <span>{new Date().toUTCString()}</span>
        </p>
      </div>
    </div>
  );
};

export default DataUpdateKnow;
