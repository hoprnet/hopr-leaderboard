import { ConnectWallet } from "../atoms/ConnectWallet";
import { ConnectIDX } from "../atoms/ConnectIDX.js";

export const Connectors = ({
  address,
  idx,
  setIdx,
  connectIdx
}) => {
  return (
    <>
      <ConnectWallet>
        {address && connectIdx && (
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
