import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";

export const EligibilityPerAddress = () => {
  const { account } = useEthers();
  const [eligibility, setEligibility] = useState("0.0 MATIC, 10 mHOPR");
  useEffect(() => {
    const loadEligibility = async () => {
      const response = await fetch(`/api/faucet/eligible/${account}`).then(
        (res) => res.json()
      );
      if (response.status === "ok") {
        setEligibility(`0.01 MATIC, ${response.eligible} mHOPR`);
      }
    };
    loadEligibility();
  });
  return (
    <div style={{ marginBottom: "15px" }}>
      <p>
        <b>Eligibility</b><span style={{ color: "green", marginLeft: "5px"}}>{eligibility}</span>
      </p>
      <small>
        If you participated in our{" "}
        <a href="https://stake.hoprnet.org" target="_blank">
          staking program
        </a>{" "}
        before the 6<sup>th</sup> of August 2021 CEST 12:00hrs, HOPR Association
        will fund your nodes with both MATIC (0.01) and mHOPR funds (10),
        otherwise we’ll only provide you with mHOPR.
      </small>
    </div>
  );
};
