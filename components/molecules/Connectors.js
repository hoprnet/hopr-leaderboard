import { ConnectWallet } from "../atoms/ConnectWallet";
import { ConnectIDX } from "../atoms/ConnectIDX.js";

export const Connectors = ({
  address,
  idx,
  setIdx,
}) => {
  return (
    <>
      <ConnectWallet>
        {address && (
          <ConnectIDX
            idx={idx}
            address={address}
            setIdx={setIdx}
          />
        )}
      </ConnectWallet>
    </>
  );
};
