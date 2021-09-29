import { TileDocument } from "@ceramicnetwork/stream-tile";
import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { client, did } from "../../../../constants/api";
import {
  HOPR_WEB3_SIGNATURE_DOMAIN,
  HOPR_WEB3_SIGNATURE_TYPES
} from "../../../../constants/hopr";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  const { signature, message } = req.body;

  const signerAddress = utils.verifyTypedData(
    HOPR_WEB3_SIGNATURE_DOMAIN,
    HOPR_WEB3_SIGNATURE_TYPES,
    message,
    signature
  );

  const isValidSignature: boolean = address == signerAddress;

  if (isValidSignature) {    
    const { ethAddress, hoprAddress } = message;
      
    await did.authenticate();
    client.setDID(did);

    const docs: TileDocument<null> = await TileDocument.create(client, null, {
        deterministic: true,
        tags: [ethAddress],
        family: "hopr-wildhorn",
    });

    const mutatedDoc = Object.assign({}, docs.content);
    delete mutatedDoc[hoprAddress]

    // // NB: No waiting on update to avoid blocking server
    docs.update(mutatedDoc);

    return res.status(200).json({
        status: "ok",
        streamId: docs.id.toString(),
        message: `Your node was deleted and updated into the Ceramic network.`,
    });
    
  } else {
    return res.json({
      status: "err",
      message: "Signature is invalid.",
    });
  }

};
