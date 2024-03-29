import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import Ceramic from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { CERAMIC_IDX_ALIASES } from "../../constants/ceramic";
import { DID } from "dids";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import { CERAMIC_API_URL } from "../../constants/ceramic";
import { useEffect, useState } from "react";

export const ConnectIDX = ({ address, idx, setIdx }) => {
  const [threeIdConnect, setThreeIdConnect] = useState();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const threeIdConnect = new ThreeIdConnect();
    setThreeIdConnect(threeIdConnect);
    return () => {
      setIdx(null);
    };
  }, [address]);

  const authenticateCeramic = async () => {
    try {
      setLoading(true);
      const authProvider = new EthereumAuthProvider(window.ethereum, address);
      await threeIdConnect.connect(authProvider);

      const ceramic = new Ceramic(CERAMIC_API_URL);
      const provider = threeIdConnect.getDidProvider();
      const _did = new DID({
        provider: provider,
        resolver: ThreeIdResolver.getResolver(ceramic),
      });
      ceramic.did = _did;

      await ceramic.did.authenticate();
      await _did.authenticate();

      const idx = new IDX({ ceramic, aliases: CERAMIC_IDX_ALIASES });
      setIdx(idx);
      setLoading(false);
    } catch (e) {
      console.error("Fail to connect to the Ceramic network", e);
      setLoading(false);
    }
  };
  return (
    <>
      {!idx && (
        <button disabled={isLoading} onClick={() => authenticateCeramic()}>
          {isLoading ? "Loading..." : "Connect to IDX"}
        </button>
      )}
    </>
  );
};
