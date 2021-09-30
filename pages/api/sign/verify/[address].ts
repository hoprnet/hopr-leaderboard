import { NextApiRequest, NextApiResponse } from "next";
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_FOR_NODE_TYPES,
} from "../../../../constants/hopr";
import { utils } from "ethers";
import { client, did } from "../../../../constants/api";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { verifySignatureFromPeerId } from "@hoprnet/hopr-utils";

const HOPR_PREFIX = "HOPR Signed Message: ";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = utils.verifyTypedData(
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

        const docs: TileDocument<null> = await TileDocument.create(
          client,
          null,
          {
            deterministic: true,
            tags: [ethAddress],
            family: "hopr-wildhorn",
          }
        );

        const mutatedDoc = Object.assign({}, docs.content, {
          [hoprAddress]: ethAddress,
        });

        // NB: No waiting on update to avoid blocking server
        docs.update(mutatedDoc);

        return res.status(200).json({
          status: "ok",
          streamId: docs.id.toString(),
          message: `Your node was recorded into the Ceramic network.`,
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
        message: `Invalid HOPR address during node verification: ${hoprAddress}. Please use a correct one or reach our ambassadors with your ETH address for support.`,
      });
    }
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }
};
