const CONTRACT_ADDRESS = "0x107E2C6dd34C883161c2f1F619e651A5F1b4981F"; // replace with your deployed contract
const CONTRACT_ABI = [
  {"inputs":[{"internalType":"string","name":"uri","type":"string"}],"name":"mint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"}
];

let provider, signer, contract, totalMinted = 0;
const metadataList = [
  "https://raw.githubusercontent.com/sodhare-code/zenchain-nft-minter/main/metadata/1.json",
  "https://raw.githubusercontent.com/sodhare-code/zenchain-nft-minter/main/metadata/2.json",
  "https://raw.githubusercontent.com/sodhare-code/zenchain-nft-minter/main/metadata/3.json",
  "https://raw.githubusercontent.com/sodhare-code/zenchain-nft-minter/main/metadata/4.json"
];

const connectBtn = document.getElementById("connectBtn");
const mintBtn = document.getElementById("mintBtn");
const walletText = document.getElementById("wallet");
const statusText = document.getElementById("status");
const mintSection = document.getElementById("mintSection");
const tokenInput = document.getElementById("tokenURI");
const totalMintedText = document.getElementById("totalMinted");

connectBtn.addEventListener("click", async () => {
  try {
    if (!window.ethereum) {
      statusText.innerText = "MetaMask not detected. Install MetaMask and reload.";
      return;
    }
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const addr = await signer.getAddress();
    walletText.innerText = "Connected: " + addr;
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    statusText.innerText = "Wallet connected. Ready to mint!";
    mintSection.style.display = "block";
  } catch (err) {
    statusText.innerText = "Connection error: " + (err?.message || err);
  }
});

mintBtn.addEventListener("click", async () => {
  if (!contract) { statusText.innerText = "Connect wallet first."; return; }
  let uri = tokenInput.value.trim();
  if (!uri) {
    if (totalMinted >= metadataList.length) {
      statusText.innerText = "No more NFTs available to mint automatically.";
      return;
    }
    uri = metadataList[totalMinted];
  }
  try {
    statusText.innerText = "Sending transaction... Confirm in MetaMask.";
    const tx = await contract.mint(uri);
    const receipt = await tx.wait();
    let tokenId = null;
    if (receipt.events) {
      for (const e of receipt.events) {
        if (e.event === 'Transfer' && e.args?.tokenId) {
          tokenId = e.args.tokenId.toString();
          break;
        }
      }
    }
    totalMinted++;
    totalMintedText.innerText = "Total Minted: " + totalMinted;
    statusText.innerText = `Mint confirmed!\nTx: ${tx.hash}\nToken ID: ${tokenId}\nMetadata: ${uri}`;
  } catch (err) {
    statusText.innerText = "Mint error: " + (err?.message || err);
  }
});
