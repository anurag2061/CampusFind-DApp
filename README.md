# CampusFind DApp

CampusFind is an educational decentralized lost-and-found registry for a college campus. Reports are stored on the Ethereum blockchain and can be read by anyone. Only the wallet that created a report can mark it as resolved.

## Features
- Solidity smart contract with constructor, state variables, validation, mappings, events and access control.
- Frontend built with HTML, CSS and JavaScript.
- MetaMask wallet integration using ethers.js v6.
- Create and read reports through blockchain transactions and view calls.
- Reporter-only resolution action.
- Tests for valid, invalid and unauthorized inputs.

## Project structure
- `contracts/CampusFind.sol` — smart contract.
- `frontend/index.html` — UI.
- `frontend/style.css` — styling.
- `frontend/app.js` — MetaMask and contract integration.
- `TEST_CASES.md` — test plan and expected results.
- `evidence/` — add your own screenshots here.

## Deployment (Remix + Ganache)
1. Install Ganache and MetaMask, or use a test network approved by your instructor.
2. Start a local Ganache workspace and add its network to MetaMask. Use the RPC URL and chain ID shown by Ganache.
3. In Remix, create `CampusFind.sol`, paste the source, select compiler `0.8.20` or a compatible `0.8.x` compiler, and compile.
4. In Remix **Deploy & Run Transactions**, select **Injected Provider - MetaMask**. Confirm MetaMask is connected to the intended Ganache/test network.
5. Deploy `CampusFind` and confirm the deployment transaction.
6. Copy the deployed contract address. In `frontend/app.js`, replace `PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE` with the address. The ABI is included in the file.
7. Serve the frontend from the project root, for example:
   ```bash
   cd frontend
   python -m http.server 8000
   ```
8. Open `http://localhost:8000` in a browser with MetaMask enabled. Connect the wallet and submit a test report.
9. Use the same network and deployed contract address in MetaMask and the frontend. Ganache accounts need to be imported into MetaMask only for a local test setup; never use a real wallet's seed phrase or private key in code or GitHub.

## How to use
1. Connect MetaMask.
2. Choose “I lost an item” or “I found an item”.
3. Enter a title, description and location, then submit the transaction.
4. Reports appear in the registry after the transaction confirms.
5. The reporting wallet can mark its own open report as resolved.

## Security and privacy notes
- Blockchain data is public and generally immutable. Do not put phone numbers, student IDs, home addresses, or other sensitive personal data into report fields.
- This is an academic demo, not a production lost-property system.
- Never commit seed phrases, private keys, passwords, or `.env` files containing credentials.

## Deployment details — complete after deployment
- Network: `[Ganache / test network name]`
- Chain ID: `[enter chain ID]`
- Contract address: `[paste deployed address]`
- Deployer wallet: `[public address only]`

## Evidence checklist
Save screenshots into `evidence/` and link them here before submission:
- [ ] Remix contract compilation
- [ ] Contract deployment and address
- [ ] MetaMask connected
- [ ] Successful report transaction
- [ ] Failed validation / unauthorized transaction
- [ ] Blockchain data displayed in the UI

## Testing
See `TEST_CASES.md`. Record actual outcomes and add screenshots; do not claim a test passed until you have run it on your deployment.
