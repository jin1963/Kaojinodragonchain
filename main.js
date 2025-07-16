let web3;
let user;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      user = accounts[0];
      document.getElementById("walletAddress").innerText = "✅ " + user;
      loadBalances();
    } catch (err) {
      console.error(err);
      alert("Wallet connection failed");
    }
  } else {
    alert("⚠️ No wallet found");
  }
}

document.getElementById("connectWallet").onclick = connectWallet;

async function loadBalances() {
  const tokens = [
    { id: 'kjcBalance', address: config.kjc.address },
    { id: 'g3x24Balance', address: config.g3x24.address },
    { id: 'lydiaBalance', address: config.lydia.address }
  ];

  for (let token of tokens) {
    const contract = new web3.eth.Contract(config.abi, token.address);
    const balance = await contract.methods.balanceOf(user).call();
    document.getElementById(token.id).innerText = web3.utils.fromWei(balance, 'ether');
  }
}

async function addToken(symbol, name, decimals, image, address) {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image: window.location.origin + '/' + image,
        },
      },
    });
    if (wasAdded) {
      alert(symbol + ' token added!');
    } else {
      alert('Add token rejected.');
    }
  } catch (error) {
    console.error(error);
    alert('Error adding token.');
  }
}
