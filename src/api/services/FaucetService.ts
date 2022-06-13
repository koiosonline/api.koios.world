import ABI from "../json/ABI.json";
import Web3 from "web3";

export const executeClaim = async (claimerAddress, data) => {
  console.log(process.env.CONTRACT_ADDRESS);
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const privateKey = process.env.PRIV_KEY;
  let web3 = new Web3(process.env.FAUCETPROVIDER);

  let contract = new web3.eth.Contract(
    JSON.parse(ABI.result),
    CONTRACT_ADDRESS
  );
  let account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
  let status = { status: 1, message: "Successfully claimed!" };

  if (data.success) {
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    await contract.methods
      .claim(claimerAddress)
      .estimateGas({
        from: account.address,
      })
      .then(async function (gasAmount) {
        const nextNonce = await web3.eth.getTransactionCount(
          web3.eth.defaultAccount,
          "pending"
        );
        contract.methods.claim(claimerAddress).send({
          from: account.address,
          gasLimit: gasAmount,
          nonce: nextNonce,
        });
      })
      .catch((err) => {
        console.log("[Gas Estimation]: " + err);
        status.status = 0;
        status.message = "Address already claimed!";
      });
  } else {
    status.status = 3;
    status.message = "Invalid Captcha!";
  }

  return status;
};