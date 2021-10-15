import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NextPage } from "next";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import Ceramic from "@ceramicnetwork/http-client";
import { CERAMIC_API_URL, CERAMIC_IDX_ALIASES } from "../../constants/ceramic";
import { DID } from "dids";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import { IDX } from "@ceramicstudio/idx";
import { Buttons } from "../atoms/button/buttons";

interface ConnectIDXProps {
  address: string;
  idx?: IDX | null;
  setIdx?: Dispatch<SetStateAction<IDX | null | undefined>>;
}

export const ConnectIDX: NextPage<ConnectIDXProps> = ({
  address,
  idx,
  setIdx,
}) => {
  const [threeIdConnect, setThreeIdConnect] = useState<ThreeIdConnect>();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const threeIdConnect = new ThreeIdConnect();
    setThreeIdConnect(threeIdConnect);
    return () => {
      setIdx!(null);
    };
  }, [address]);

  const authenticateCeramic = async () => {
    try {
      setLoading(true);
      const authProvider = new EthereumAuthProvider(
        (Window as any).window.ethereum,
        address
      );
      await threeIdConnect!.connect(authProvider);

      const ceramic = new Ceramic(CERAMIC_API_URL);
      const provider = threeIdConnect!.getDidProvider();
      const _did = new DID({
        provider: provider,
        resolver: ThreeIdResolver.getResolver(ceramic),
      });
      ceramic.did = _did;

      await ceramic.did.authenticate();
      await _did.authenticate();

      const idx = new IDX({ ceramic, aliases: CERAMIC_IDX_ALIASES });
      setIdx!(idx);
      setLoading(false);
    } catch (e) {
      console.error("Fail to connect to the Ceramic network", e);
      setLoading(false);
    }
  };

  return (
    <>
      {!idx && (
        <Buttons
          disabled={isLoading}
          onClick={() => authenticateCeramic()}
          text={isLoading ? "Loading..." : "Connect to IDX"}
        />
      )}
    </>
  );
};
