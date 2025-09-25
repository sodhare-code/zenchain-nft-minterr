let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0xYourNFTContractAddress"; // Replace with deployed contract
const CONTRACT_ABI = [
  "function mint(string memory name, string memory desc, string memory image) public"
]; // Simplified ABI

document.getElementById("connectBtn").onclick = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    document.getElementById("status").innerText = "✅ Wallet connected!";
    document.getElementById("minter").style.display = "block";
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  } else {
    alert("Install MetaMask!");
  }
};

document.getElementById("mintBtn").onclick = async () => {
  const name = document.getElementById("nftName").value;
  const desc = document.getElementById("nftDesc").value;
  const img = document.getElementById("nftImg").value;

  try {
    const tx = await contract.mint(name, desc, img);
    document.getElementById("status").innerText = "⏳ Minting...";
    await tx.wait();
    document.getElementById("status").innerText = "🎉 NFT Minted Successfully!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "❌ Error: " + err.message;
  }
};
