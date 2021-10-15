import { NextApiRequest, NextApiResponse } from "next";
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
} from "../../../../../../constants/hopr";
import { utils } from "ethers";
import { verifySignatureFromPeerId } from "@hoprnet/hopr-utils";
import { client, did } from "../../../../../../constants/api";
import { TileDocument } from "@ceramicnetwork/stream-tile";

// NB: HOPR Node sign messages using the prefix to avoid having
// the nodes sign any generic data which could be used maliciously
// (e.g. a transfer request). Thus, we need to prefix the message
// to get a valid signature.

// see https://github.com/hoprnet/hoprnet/blob/master/packages/core/src/index.ts#L865-L870
const HOPR_PREFIX = "HOPR Signed Message: ";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { streamId, address } = req.query;
  const { signature, message } = req.body;

  const signerAddress: string = utils.verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
    message,
    signature
  );
  const isValidSignature: boolean = address == signerAddress;

  if (isValidSignature) {
    const checksumedAddress: string = utils.getAddress(address.toString());
    const { hoprSignature, hoprAddress, ethAddress } = message;
    const messageSignedByNode: string = `${HOPR_PREFIX}${ethAddress}`;

    try {
      const isAddressOwnerOfNode: boolean = await verifySignatureFromPeerId(
        hoprAddress,
        messageSignedByNode,
        hoprSignature
      );
      if (isAddressOwnerOfNode) {
        await did.authenticate();
        client.setDID(did);

        const dashboard: TileDocument<null> = await TileDocument.create(
          client,
          null,
          {
            deterministic: true,
            tags: ["hopr-dashboard"],
            family: "hopr-wildhorn",
          }
        );

        const mutatedDashboard = Object.assign({}, dashboard.content, {
          [streamId.toString()]: ethAddress,
        });

        // NB: We will not wait for the update of the dashboard to avoid issues w/timeouts.
        dashboard.update(mutatedDashboard);

        return res.status(200).json({
          status: "ok",
          streamId: dashboard.id.toString(),
          message: `The dashboard update was recorded into the Ceramic network.`,
        });
      } else {
        return res.status(200).json({
          status: "invalid",
          address: checksumedAddress,
          node: hoprAddress,
          message: `Your signature does not match the address you are submitting. Please try with a new signature.`,
        });
      }
    } catch (e) {
      return res.status(200).json({
        status: "err",
        hoprAddress,
        message: `Invalid HOPR address during dashboard verification: ${hoprAddress}. Please use a correct one or reach our ambassadors with your ETH address for support.`,
      });
    }
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
