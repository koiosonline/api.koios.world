const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const axios = require("axios").default;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 2020;
const app = express();
app.use(helmet());
app.use("/claim", cors());
app.use("/claim", express.json());
app.use(cors());

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "POST",
};

//Contract stuff
const ABI = require("../koios-faucet/ABI.json");
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIV_KEY;
const Web3 = require("web3");
let web3 = new Web3(
  "https://rinkeby.infura.io/v3/8e4de63cfa6842e2811b357d94423d01"
);

let contract = new web3.eth.Contract(JSON.parse(ABI.result), CONTRACT_ADDRESS);
let account = web3.eth.accounts.privateKeyToAccount("0x" + privateKey);

app.get("/", cors(corsOptions), (req, res) => {
  console.log(req.query.address);
  let events = contract
    .getPastEvents("addressClaimed", { fromBlock: 0, toBlock: "latest" })
    .then(function (events) {
      console.log(events);
      res.json(events);
    });
});

app.listen(PORT, () => {
  console.log("server is listening on port ");
});

app.post("/claim", cors(corsOptions), async function (req, res) {
  const { claimerAddress, captchaToken } = req.body;

  const googleRes = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${captchaToken}`
  );
  const data = googleRes.data;
  let callback = await executeClaim(claimerAddress, data);
  res.json({
    status: callback.status,
    message: callback.message,
  });
});

async function executeClaim(claimerAddress, data) {
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
