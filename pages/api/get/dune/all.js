import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { CERAMIC_API_URL } from "../../../../constants/ceramic";
import PeerId from "peer-id";
import { PublicKey } from "@hoprnet/hopr-utils";

import { utils } from "ethers";

const secretKey = Uint8Array.from(
  utils.arrayify(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
);
const provider = new Ed25519Provider(secretKey);
const did = new DID({ provider, resolver: KeyResolver.getResolver() });
const client = new CeramicClient(CERAMIC_API_URL);

const convertHoprAddressToETHAddress = (hoprAddress) => {
  const pId = PeerId.createFromB58String(hoprAddress);
  const ethAddress = PublicKey.fromPeerId(pId).toAddress().toHex();
  return ethAddress; 
}

export default async (req, res) => {
  const { flattened } = req.query;
  await did.authenticate();
  client.setDID(did);

  const records = await TileDocument.create(
    client,
    null,
    { deterministic: true, family: "hopr-wildhorn", tags: ["hopr-dashboard"] },
    { anchor: false, publish: false }
  );

  // const streams = [
  //   Object.keys(records.content)[0],
  //   "k2t6wyfsu4pg30809vivmrrqxawb3hm6yfluqzsvivfk3d928amo4kqokd6gol", // 2 entries
  //   "k2t6wyfsu4pg2w843yg72227bt2y6mtficy6bnug68qqsoge8l20xyo4f6gnoc", // empty
  // ];

  const allStreams = Object.keys(records.content);
  console.log("ALL STREAMS", allStreams)
  const streams = allStreams.slice(100);

  const duneReadyParsedRecordPromises = streams.map(async (streamId) => {
    const ethAddress = records.content[streamId];

    const doc = await TileDocument.create(
      client,
      null,
      { deterministic: true, family: "hopr-wildhorn", tags: [ethAddress] },
      { anchor: false, publish: false }
    );

    const hoprAddresses = Object.keys(doc.content);
    /*
      Considering we have 1 ETH -> * HOPR_Address, we need to produce as a result
      an string that's able to reprsent the relationship between ETH addresses and
      HOPR_addresses on a 1 <-> 1 in a single string.
     
      e.g. { ethAddress: "0x1234...", hoprAddresses: ["16u2111...", "16u2222..."]}
     
      Dune requires this information be formatted as
     
      ethAddress = 0x1234...,0x1234...
      hoprAddress = 16u2111...,16u2222... 
     */
    console.log("ADDRESSES", hoprAddresses);
    const duneFormatPerAddress = hoprAddresses.length > 0 && hoprAddresses.reduce(
      (acc, val) => {
        return ({
          ethAddress: acc.ethAddress
            ? `${acc.ethAddress},${ethAddress}`
            : ethAddress,
          hoprAddresses: acc.hoprAddresses
            ? `${acc.hoprAddresses},${convertHoprAddressToETHAddress(val)}`
            : convertHoprAddressToETHAddress(val),
        });
      },
      { ethAddress: "", hoprAddresses: "" }
    );

    return duneFormatPerAddress;
  });

  const unfilteredRegistrationRecords = await Promise.all(duneReadyParsedRecordPromises);
  const registrationRecords = unfilteredRegistrationRecords.filter( record => !!record );
  /*
   With the multiple records organized in structures ready to be flatten, we
   can now return a single string line for a given amount of entries. For better
   or worse, Dune is only able to query up to `186` addresses in a single string.
   We'll default to 180 for easy counting.
    
    Given
    [
      {
        ethAddress: '0x2402da10A6172ED018AEEa22CA60EDe1F766655C',
        hoprAddresses: '16Uiu2HAm8NkpLp4NDJCMJcKWQTU3eMZA26cTYcsXvhaTcjVvZUTV'
      },
      {
        ethAddress: '0x0F23750590Dd818E2f5285B7225249B9fb7F0E75,0x0F23750590Dd818E2f5285B7225249B9fb7F0E75',
        hoprAddresses: '16Uiu2HAm2WFVcLD8vxuMZDDUFokjVFu8pPTFmjixKD2r3JgH9FjV,16Uiu2HAmBgdPEXbhnYhL2nKoX9KY9Rrr162ADW4cLs43KGgbD4tE'
      }
    ]

    We need to return.

    { 
      ethAddress: '0x2402da10A6172ED018AEEa22CA60EDe1F766655C','0x0F23750590Dd818E2f5285B7225249B9fb7F0E75,0x0F23750590Dd818E2f5285B7225249B9fb7F0E75'
      hoprAddresses: '16Uiu2HAm8NkpLp4NDJCMJcKWQTU3eMZA26cTYcsXvhaTcjVvZUTV','16Uiu2HAm2WFVcLD8vxuMZDDUFokjVFu8pPTFmjixKD2r3JgH9FjV,16Uiu2HAmBgdPEXbhnYhL2nKoX9KY9Rrr162ADW4cLs43KGgbD4tE'
    }
   */

    console.log("Pre flatten Records", registrationRecords);

  const flattenedRegistrationRecords = registrationRecords.reduce(
    (acc, val) => {
      return {
        ethAddress: acc.ethAddress
          ? `${acc.ethAddress},${val.ethAddress}`
          : val.ethAddress,
        hoprAddresses: acc.hoprAddresses
          ? `${acc.hoprAddresses},${val.hoprAddresses}`
          : val.hoprAddresses,
      };
    },
    { ethAddress: "", hoprAddresses: "" }
  );

  console.log("Records", flattenedRegistrationRecords);

  return res.status(200).json({
    status: "ok",
    tileId: records.id.toString(),
    records: flattenedRegistrationRecords,
  });
};
