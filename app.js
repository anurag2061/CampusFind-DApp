/*
  Setup:
  1. Compile contracts/CampusFind.sol in Remix.
  2. Deploy to Ganache or an Ethereum test network.
  3. Copy the deployed address and ABI into the constants below.
  4. Serve this frontend over localhost (for example: python -m http.server 8000).
*/
const CONTRACT_ADDRESS = "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE";
const CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"reporter","type":"address"},{"indexed":false,"internalType":"bool","name":"isFoundItem","type":"bool"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"ReportCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"resolver","type":"address"}],"name":"ReportResolved","type":"event"},
  {"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"bool","name":"isFoundItem","type":"bool"}],"name":"createReport","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"getAllReports","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"reporter","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"bool","name":"isFoundItem","type":"bool"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"enum CampusFind.ItemStatus","name":"status","type":"uint8"}],"internalType":"struct CampusFind.ItemReport[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"getReport","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"reporter","type":"address"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"location","type":"string"},{"internalType":"bool","name":"isFoundItem","type":"bool"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"enum CampusFind.ItemStatus","name":"status","type":"uint8"}],"internalType":"struct CampusFind.ItemReport","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getReportCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"nextReportId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"resolveReport","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

let provider, signer, contract, currentAccount;

const $ = (id) => document.getElementById(id);
function setStatus(message, kind = "") {
  $("status").textContent = message;
  $("status").className = "status" + (kind ? " " + kind : "");
}
function configured() {
  if (CONTRACT_ADDRESS === "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE") {
    setStatus("Setup needed: paste your deployed contract address into frontend/app.js.", "error");
    return false;
  }
  return true;
}
async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask was not detected. Install/enable the MetaMask browser extension.");
  if (!configured()) return;
  const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  currentAccount = accounts[0];
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  $("connectBtn").textContent = currentAccount.slice(0, 6) + "…" + currentAccount.slice(-4);
  setStatus("Wallet connected: " + currentAccount, "success");
  await loadReports();
}
async function loadReports() {
  if (!contract) {
    if (!window.ethereum) { setStatus("Install MetaMask to interact with this DApp."); return; }
    if (!configured()) return;
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    } catch (e) { setStatus(e.message, "error"); return; }
  }
  try {
    const [all, count] = await Promise.all([contract.getAllReports(), contract.getReportCount()]);
    $("reportCount").textContent = count.toString();
    const root = $("reports");
    root.innerHTML = "";
    if (!all.length) {
      root.innerHTML = '<div class="report-card"><p>No reports yet. Be the first to contribute.</p></div>';
      setStatus("Blockchain data loaded successfully.", "success");
      return;
    }
    [...all].reverse().forEach((r) => {
      const id = r.id.toString();
      const found = r.isFoundItem;
      const resolved = Number(r.status) === 1;
      const card = document.createElement("article");
      card.className = "report-card";
      const top = document.createElement("div"); top.className = "card-top";
      const tag = document.createElement("span");
      tag.className = "tag" + (found ? " found" : "") + (resolved ? " resolved" : "");
      tag.textContent = resolved ? "RESOLVED" : (found ? "FOUND ITEM" : "LOST ITEM");
      const idLabel = document.createElement("span"); idLabel.className = "meta"; idLabel.textContent = "#" + id;
      top.append(tag, idLabel);
      const h = document.createElement("h3"); h.textContent = r.title;
      const desc = document.createElement("p"); desc.textContent = r.description;
      const meta = document.createElement("div"); meta.className = "meta";
      meta.textContent = "Location: " + r.location + " · Reporter: " + r.reporter.slice(0, 8) + "…" + r.reporter.slice(-6) + " · " + new Date(Number(r.createdAt) * 1000).toLocaleString();
      card.append(top, h, desc, meta);
      if (!resolved && currentAccount && r.reporter.toLowerCase() === currentAccount.toLowerCase()) {
        const actions = document.createElement("div"); actions.className = "card-actions";
        const btn = document.createElement("button"); btn.className = "button secondary"; btn.textContent = "Mark resolved";
        btn.addEventListener("click", async () => {
          try {
            btn.disabled = true; setStatus("Waiting for MetaMask approval…");
            const tx = await contract.resolveReport(r.id);
            setStatus("Transaction submitted. Waiting for confirmation…");
            await tx.wait(); setStatus("Report #" + id + " marked resolved.", "success"); await loadReports();
          } catch (e) { setStatus(e.shortMessage || e.reason || e.message || "Transaction failed.", "error"); btn.disabled = false; }
        });
        actions.appendChild(btn); card.appendChild(actions);
      }
      root.appendChild(card);
    });
    setStatus("Loaded " + count.toString() + " report(s) from the blockchain.", "success");
  } catch (e) {
    setStatus(e.shortMessage || e.reason || e.message || "Could not load reports. Check network and contract address.", "error");
  }
}
$("connectBtn").addEventListener("click", async () => {
  try { await connectWallet(); } catch (e) { setStatus(e.shortMessage || e.message || "Wallet connection failed.", "error"); }
});
$("refreshBtn").addEventListener("click", loadReports);
$("reportForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    if (!contract || !signer) await connectWallet();
    if (!contract || !signer) return;
    const title = $("title").value.trim();
    const description = $("description").value.trim();
    const location = $("location").value.trim();
    if (!title || !description || !location) { setStatus("All fields are required.", "error"); return; }
    const isFound = $("kind").value === "true";
    setStatus("Confirm the transaction in MetaMask…");
    const tx = await contract.createReport(title, description, location, isFound);
    setStatus("Transaction submitted. Waiting for confirmation…");
    await tx.wait();
    $("reportForm").reset();
    setStatus("Report recorded successfully on-chain.", "success");
    await loadReports();
  } catch (e) {
    setStatus(e.shortMessage || e.reason || e.message || "Transaction failed.", "error");
  }
});
if (window.ethereum) {
  window.ethereum.on?.("accountsChanged", () => { currentAccount = null; contract = null; $("connectBtn").textContent = "Connect MetaMask"; });
  window.ethereum.on?.("chainChanged", () => window.location.reload());
}
loadReports();
