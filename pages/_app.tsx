import { ChainId, DAppProvider, MULTICALL_ADDRESSES } from "@usedapp/core";
import { AppProps } from "next/dist/shared/lib/router/router";
import "../styles/main.scss";

export const INFURA_ID = "dc5285828a434143a550a45f18c86865";

const config = {
  readOnlyUrls: {
    [ChainId.Polygon]: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
  },
  supportedChains: [ChainId.Polygon],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
  },
};

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <DAppProvider config={config}>
      <Component {...pageProps} />
    </DAppProvider>
  );
}

export default MyApp;
