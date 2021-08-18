import { Contract, providers, utils } from 'ethers'
import { formatEther } from '@ethersproject/units';
import { TOKEN_ADDRESS_POLYGON } from '../../../constants/hopr'
export default async (_req, res) => {
    const faucetAddress = utils.computeAddress(`0x${process.env.HOPR_DASHBOARD_API_PRIVATE_KEY}`)
    const provider = new providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${ process.env.HOPR_DASHBOARD_API_INFURA_ID }`)
    const faucetHoprBalance = await new Contract(
      TOKEN_ADDRESS_POLYGON,
      ['function balanceOf(address owner) view returns (uint256)'],
      provider
    )
      .balanceOf(faucetAddress)
      .then(b => formatEther(b))

    const faucetNativeBalance = await provider.getBalance(faucetAddress).then(b => formatEther(b));

    if (faucetHoprBalance && faucetNativeBalance) {
      res.statusCode = 200;
      return res.json({ status: 'ok', balance: { hopr: faucetHoprBalance, native: faucetNativeBalance }});
    } else {
      res.statusCode = 501;
      return res.json({ status: 'err'});
    }
  };