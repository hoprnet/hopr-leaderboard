import { Stream } from "@ceramicnetwork/common";
import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../../../constants/api";
import { IGetDuneMissingVal, IReduceAll, ISQLAll } from "../../../../../types";
import { convertHoprAddressToETHAddress } from "../../../../../utils/hopr";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { parsed, batch } = req.query;
  await did.authenticate();
  client.setDID(did);

  const addresses = await import(
    `../../../../../../constants/missing/${batch}/addresses`
  );

  let streamsMap: { [key: string]: [] }, streamMap: Record<string, Stream>;
  // NB: We have a specific batch which is hardcoded, so unfortunately we don’t have streams
  // but instead the HOPR addresses directly.
  if (batch !== "3") {
    const { streams } = addresses;
    streamsMap = addresses.streamsMap;
    const queries = streams.map((streamId: string) => ({ streamId }));
    streamMap = await client.multiQuery(queries);
  } else {
    // NB: We need to format the hardcoded addresses for our algorithm
    // currently we have nodesMap => { ethAddress: [hoprAddress] }, so
    // for hardcoded entries streamId == index of the array.
    // streamsMap = { streamId: ethAddress }
    // streamMap = { streamId: { content: [hoprAddresses] }}
    streamsMap = addresses.nodesMap.reduce(
      (acc: string, val: IGetDuneMissingVal, index: number) => {
        return Object.assign({}, acc, { [index]: val.ethAddress });
      },
      {}
    );
    streamMap = addresses.nodesMap.reduce(
      (acc: string, val: IGetDuneMissingVal, index: number) => {
        return Object.assign({}, acc, {
          [index]: {
            content: val.hoprAddresses.reduce(
              (_acc: string | {}, _val: string) =>
                Object.assign({}, _acc, { [_val]: val.ethAddress }),
              {}
            ),
          },
        });
      },
      {}
    );
  }

  const LIMIT_NODES_PER_ETH_IN_DUNE: number = 180;
  let MAX_AMOUNT_OF_NODES_PER_ETH_ADDRESS: number = 0;
  const UNIQUE_ETH_ADDRESS_REGISTERED: Array<[]> = [];
  let TOTAL_AMOUNT_OF_NODES: number = 0;

  const unfilteredRegistrationRecords = Object.keys(streamMap).map(
    (streamId) => {
      /*
        Considering we have 1 ETH -> * HOPR_Address, we need to produce as a result
        an string that's able to reprsent the relationship between ETH addresses and
        HOPR_addresses on a 1 <-> 1 in a single string.
       
        e.g. { ethAddress: "0x1234...", hoprAddresses: ["16u2111...", "16u2222..."]}
       
        Dune requires this information be formatted as
       
        ethAddress = 0x1234...,0x1234...
        hoprAddress = 16u2111...,16u2222... 
       */
      const doc = streamMap[streamId];
      const ethAddress = streamsMap[streamId];

      const hoprAddresses = Object.keys(doc.content);
      TOTAL_AMOUNT_OF_NODES += hoprAddresses ? hoprAddresses.length || 0 : 0;
      UNIQUE_ETH_ADDRESS_REGISTERED.push(ethAddress);

      const duneFormatPerAddress =
        hoprAddresses.length > 0 &&
        hoprAddresses.reduce(
          (acc, val) => {
            MAX_AMOUNT_OF_NODES_PER_ETH_ADDRESS =
              acc.length > MAX_AMOUNT_OF_NODES_PER_ETH_ADDRESS
                ? acc.length
                : MAX_AMOUNT_OF_NODES_PER_ETH_ADDRESS;
            return {
              ethAddress: acc.ethAddress
                ? `${acc.ethAddress},${ethAddress.toString().toLowerCase()}`
                : ethAddress.toString().toLowerCase(),
              hoprAddresses: acc.hoprAddresses
                ? `${acc.hoprAddresses},${convertHoprAddressToETHAddress(
                    val
                  ).toLowerCase()}`
                : convertHoprAddressToETHAddress(val).toLowerCase(),
              length: acc.length + 1,
            };
          },
          { ethAddress: "", hoprAddresses: "", length: 0 }
        );

      return duneFormatPerAddress;
    }
  );

  const registrationRecords = unfilteredRegistrationRecords.filter(
    (record) => !!record
  );
  const SAFE_LIMIT_FOR_HOPR_NODES_FOR_DUNE =
    LIMIT_NODES_PER_ETH_IN_DUNE - MAX_AMOUNT_OF_NODES_PER_ETH_ADDRESS;
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
  const flattenedRegistrationRecords = registrationRecords.reduce(
    (acc: IReduceAll | any, val: IReduceAll | any, index: number, allRecords: IReduceAll | any) => {
      const currentBatchLength = acc.currentLength + val.length;
      const nextLength = allRecords[index + 1]
        ? allRecords[index + 1].length
        : 0;

      /*
        We create the batches for flattening based on our SAFE_LIMIT_FOR_HOPR_NODES_FOR_DUNE,
        which allows us to wrap them in a value that Dune can understand. To do so, we iterate
        over all the existing valid records, and separate them in batches where
  
        [0 < batch.length < SAFE_LIMIT_FOR_HOPR_NODES_FOR_DUNE]
  
        by counting the total of the current node length and the batch's length. Whenever batch.length
        is more than our limit, we create a new batch and restart all counters.
  
        e.g. records = . ..  . . .... . .. . . ..... . . . .... .. . . , upperLimit = 5
        records.reduce => [., .., ., .], [...., .], [.., ., .,], [.....], [., ., .,], [....], [.., ., .]
        */

      const currentBatchWithNewRecord = {
        ethAddress: acc.currentBatch.ethAddress
          ? `${acc.currentBatch.ethAddress},${val.ethAddress}`
          : val.ethAddress,
        hoprAddresses: acc.currentBatch.hoprAddresses
          ? `${acc.currentBatch.hoprAddresses},${val.hoprAddresses}`
          : val.hoprAddresses,
      };
      let allBatches, currentBatch, currentLength;
      if (
        currentBatchLength + nextLength >
        SAFE_LIMIT_FOR_HOPR_NODES_FOR_DUNE
      ) {
        // We are at our max batch rate, and it's time to create a new one,
        // we reset the currentBatch to start the new one, as well as length.
        allBatches = acc.allBatches.concat(currentBatchWithNewRecord);
        currentBatch = { ethAddress: "", hoprAddress: "" };
        currentLength = 0;
      } else {
        // We can keep the current one, concatenate it and send it to the batch,
        // if there's no next value, we append our current batch to allBatches,
        // otherwise, it remains the same as before.
        if (!allRecords[index + 1]) {
          allBatches = acc.allBatches.concat(currentBatchWithNewRecord);
        } else {
          allBatches = acc.allBatches;
        }
        currentBatch = currentBatchWithNewRecord;
        currentLength = currentBatchLength;
      }
      return { allBatches, currentBatch, currentLength };
    },
    {
      allBatches: [],
      currentBatch: { ethAddress: "", hoprAddresses: "" },
      currentLength: 0,
    }
  );

  if (parsed) {
    const sqlBlock = (obj: ISQLAll) =>
      `SELECT decode(lower(substring(unnest(regexp_split_to_array('${obj.ethAddress}', ',')), 3)), 'hex')::bytea AS eoa, decode(lower(substring(unnest(regexp_split_to_array('${obj.hoprAddresses}', ',')), 3)), 'hex')::bytea AS node`;
    const parsed = flattenedRegistrationRecords.allBatches.reduce(
      (acc: string, cur: string, index: number) =>
        index === 0 ? sqlBlock((cur as unknown as ISQLAll)) : acc + " UNION ALL " + sqlBlock((cur as unknown as ISQLAll)),
      ""
    );
    return res.status(200).json({ parsed });
  }

  return res.status(200).json({
    status: "ok",
    ethAddresses: UNIQUE_ETH_ADDRESS_REGISTERED,
    uniqueEthAddresses: UNIQUE_ETH_ADDRESS_REGISTERED.length,
    totalNodes: TOTAL_AMOUNT_OF_NODES,
    records: flattenedRegistrationRecords.allBatches,
  });
};
