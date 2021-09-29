import { Ed25519Provider } from "key-did-provider-ed25519";
import { utils } from "ethers";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { CERAMIC_API_URL } from "./ceramic";
import KeyResolver from "key-did-resolver";

import ambassadors from "./json/ambassadors.json";
import community_leads from "./json/community_leads.json";
import stakers from "./json/stakers.json";
import devs from "./json/devs.json";

export const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
export const provider = new Ed25519Provider(secretKey) as any;
export const did = new DID({ provider, resolver: KeyResolver.getResolver() });
export const client = new CeramicClient(CERAMIC_API_URL);

export const whitelisted = [stakers, devs, ambassadors, community_leads];