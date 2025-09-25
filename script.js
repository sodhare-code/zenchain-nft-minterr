// script.js

// Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0xB815a5089d4DBb948CD60dC9e563D3233593C122";

// Your contract ABI (copy from Remix after compiling)
const ABI = [
  // Example minimal ABI for ERC721 mint function
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Connect to MetaMask
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await ethereum.request({ method: "eth_accounts" });
      document.getElementById("walletAddress").innerText = accounts[0];
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("User rejected connection:", error);
    }
  } else {
    alert("Please install MetaMask!");
  }
}

// Mint NFT
async function mintNFT() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.mint({ value: ethers.utils.parseEther("0.01") }); 
      // Change "0.01" if your mint price is different
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      alert("NFT Minted Successfully!");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Check console for details.");
    }
  } else {
    alert("MetaMask not detected!");
  }
}

// Show total minted NFTs
async function getTotalSupply() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    try {
      const supply = await contract.totalSupply();
      document.getElementById("totalSupply").innerText = supply.toString();
    } catch (error) {
      console.error("Error fetching supply:", error);
    }
  }
}

// Auto-load supply when site opens
window.onload = getTotalSupply;
