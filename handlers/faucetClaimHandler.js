import ABI from "../data/ABI.json" assert { type: "json" };
import Web3 from "web3";
import axios from "axios";

const faucetClaimhandler = async ({ claimerAddress, captchaToken }) => {
  const googleRes = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaToken}`
  );
  const data = googleRes.data;
  return executeClaim(claimerAddress, data);
};

async function executeClaim(claimerAddress, data) {
  console.log(process.env.CONTRACT_ADDRESS);
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
  const privateKey = process.env.PRIV_KEY;
  let web3 = new Web3(
    "https://rinkeby.infura.io/v3/8e4de63cfa6842e2811b357d94423d01"
  );

  let contract = new web3.eth.Contract(
    JSON.parse(ABI.result),
    CONTRACT_ADDRESS
  );
  let account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);
  let status = { status: 1, message: "Successfully claimed!" };

  if (data.success) {
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;
    contract.defaultChain = "rinkeby";
    contract.defaultHardfork = "london";

    console.log("Checking address: " + claimerAddress);

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
}

export default faucetClaimhandler;
