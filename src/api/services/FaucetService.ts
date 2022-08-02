import ABI from "../json/ABI.json";
import { ethers, Contract, providers, Transaction } from "ethers";

export const executeClaim = async (claimerAddress, data) => {
  const provider = new providers.JsonRpcProvider(process.env.FAUCET_PROVIDER);
  const wallet = new ethers.Wallet(process.env.FAUCET_SIGNER, provider);
  const contract = new Contract(
    process.env.CONTRACT_ADDRESS_FAUCET,
    JSON.parse(ABI.result),
    provider
  );
  let status = { status: 1, message: "Successfully claimed!" };

  if (data.success) {
    try {
      const signer = contract.connect(wallet);
      const gasPrice = await provider.getGasPrice();
      const gas = signer.estimateGas.claim(claimerAddress);
      const claimTx: Transaction = await signer.claim(claimerAddress, {
        gasPrice,
        gasLimit: gas,
      });
      if (claimTx.hash) {
        console.log(claimTx.hash);
      }
    } catch (e) {
      console.log("[Gas Estimation]: " + e);
      status.status = 0;
      status.message = "Address already claimed!";
    }
  } else {
    status.status = 3;
    status.message = "Invalid Captcha!";
  }

  return status;
};
