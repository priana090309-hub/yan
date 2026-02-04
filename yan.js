let blockchain = [];

// hash simulasi
function generateHash(text) {
  return btoa(unescape(encodeURIComponent(text))).substring(0, 16);
}

// generator id transaksi
function generateTxID() {
  return "TX-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

// genesis block
function createGenesisBlock() {
  const genesis = {
    index: 0,
    time: new Date().toLocaleString(),
    txid: "GENESIS",
    from: "-",
    to: "-",
    amount: 0,
    note: "genesis block",
    prevHash: "0000000000000000",
    hash: generateHash("genesis")
  };

  blockchain.push(genesis);
  renderBlockchain();
}

createGenesisBlock();

// tambah block
function addBlock() {
  const from = document.getElementById("fromInput").value;
  const to = document.getElementById("toInput").value;
  const amount = document.getElementById("amountInput").value;
  const note = document.getElementById("noteInput").value;

  if (from === "" || to === "" || amount === "") {
    alert("data transaksi belum lengkap!");
    return;
  }

  const lastBlock = blockchain[blockchain.length - 1];
  const txid = generateTxID();

  const dataString = txid + from + to + amount + note + lastBlock.hash;

  const newBlock = {
    index: blockchain.length,
    time: new Date().toLocaleString(),
    txid: txid,
    from: from,
    to: to,
    amount: amount,
    note: note,
    prevHash: lastBlock.hash,
    hash: generateHash(dataString)
  };

  blockchain.push(newBlock);

  document.getElementById("fromInput").value = "";
  document.getElementById("toInput").value = "";
  document.getElementById("amountInput").value = "";
  document.getElementById("noteInput").value = "";

  renderBlockchain();
}

// render blockchain
function renderBlockchain() {
  const chain = document.getElementById("blockchain");
  chain.innerHTML = "";

  blockchain.forEach((block, i) => {
    const div = document.createElement("div");
    div.className = "block";

    div.innerHTML = `
      <h3>block ${block.index}</h3>
      <p><b>waktu:</b> ${block.time}</p>
      <p><b>tx id:</b> ${block.txid}</p>
      <p><b>pengirim:</b></p>
      <input type="text" value="${block.from}" 
             onchange="tamperField(${i}, 'from', this.value)">
      <p><b>penerima:</b></p>
      <input type="text" value="${block.to}" 
             onchange="tamperField(${i}, 'to', this.value)">
      <p><b>jumlah:</b></p>
      <input type="number" value="${block.amount}" 
             onchange="tamperField(${i}, 'amount', this.value)">
      <p><b>catatan:</b></p>
      <input type="text" value="${block.note}" 
             onchange="tamperField(${i}, 'note', this.value)">
      <p class="hash"><b>hash:</b> ${block.hash}</p>
      <p class="hash"><b>prev:</b> ${block.prevHash}</p>
    `;

    chain.appendChild(div);
  });
}

// manipulasi field
function tamperField(index, field, newValue) {
  blockchain[index][field] = newValue;

  const b = blockchain[index];
  const dataString = b.txid + b.from + b.to + b.amount + b.note + b.prevHash;
  blockchain[index].hash = generateHash(dataString);

  renderBlockchain();
}

// validasi blockchain
function validateChain() {
  let valid = true;
  const blocks = document.getElementsByClassName("block");

  for (let i = 1; i < blockchain.length; i++) {
    if (blockchain[i].prevHash !== blockchain[i - 1].hash) {
      valid = false;
      blocks[i].classList.add("invalid");
    } else {
      blocks[i].classList.remove("invalid");
    }
  }

  const status = document.getElementById("status");

  if (valid) {
    status.innerText = "blockchain aman";
    status.className = "status valid";
  } else {
    status.innerText = "blockchain rusak (data dimanipulasi)";
    status.className = "status invalid-text";
  }
}