# 🕵️‍♂️ Scammer Trapper 9000

[![Status](https://img.shields.io/badge/status-live-brightgreen.svg)]()
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

> **A token risk radar for Ethereum & BSC. inspects ERC-20/BEP-20 contracts, flags suspicious patterns, and assigns a risk score.**

---

## 🟢 [View Live Demo](https://scammer-trapper-9000.onrender.com/)
**Click the link above to test the application.**

---

## 💡 Project Overview
This project demonstrates a full-stack approach to blockchain data analysis. It combines on-chain data fetching, heuristic risk analysis, and a responsive frontend to help users identify potentially malicious smart contracts (honeypots).

### Key Capabilities
* **Real-time Analysis:** Fetches live data from Ethereum and BSC nodes.
* **Algorithmic Scoring:** assigns a 0-100 risk score based on weighted heuristics.
* **Full-Stack Architecture:** Connects a Python/FastAPI backend with a vanilla JS/HTML frontend.

## 🛠 Tech Stack
* **Backend:** Python, FastAPI, Uvicorn
* **Blockchain:** Web3.py, Etherscan API, BscScan API
* **Frontend:** HTML5, CSS3 (Dark Mode), JavaScript
* **Tools:** Dotenv for config management, concurrent processing for batch jobs

## ⚠️ Disclaimer
> **Research & Education Only.**
> This tool is a portfolio project intended for educational purposes. It is not financial advice.

---

## 🔍 Features

### Risk Detection Engine
The core logic (`backend/core/score.py`) evaluates contracts against specific risk vectors:
* **Ownership Analysis:** Checks if contract ownership is renounced or hidden behind proxies.
* **Honeypot Probing:** Optional simulation of buy/sell transactions to check for traps.
* **Liquidity & Taxes:** Analyzes liquidity depth and detects hidden buy/sell taxes.
* **Code Security:** Verifies ABI status and scans for blacklist functions or minting capabilities.

### 🧮 Risk Scoring Logic
The system calculates a cumulative risk score. Higher scores indicate higher risk.

| Condition | Risk Points |
| :--- | :--- |
| Suspicious Functions | +30 |
| Ownership Not Renounced | +25 |
| ABI Not Verified | +20 |
| Low Liquidity (<$1k) | +20 |
| Mint Function Present | +15 |

**Risk Tiers:** 🟢 Low (0-24) | 🟡 Medium (25-59) | 🔴 High (60-100)

---

## 🏁 Local Development
If you wish to run this code locally or inspect the architecture:

### Prerequisites
* Python 3.8+
* Access to an Ethereum/BSC Node RPC (e.g., Alchemy, Infura)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your_username/scammer-trapper-9000.git](https://github.com/your_username/scammer-trapper-9000.git)
    cd scammer-trapper-9000
    ```

2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configuration**
    Create a `.env` file in the root directory:
    ```ini
    ETHERSCAN_API_KEY=yourKey
    WEB3_PROVIDER_ETH=[https://eth-mainnet.g.alchemy.com/v2/yourKey](https://eth-mainnet.g.alchemy.com/v2/yourKey)
    WEB3_PROVIDER_BSC=[https://bsc-dataseed.binance.org](https://bsc-dataseed.binance.org)
    ETHERSCAN_QPS=4
    ```

4.  **Run the App**
    ```bash
    uvicorn api:app --reload
    ```

## 📂 Project Structure
```text
scammer-trapper-9000/
├── api.py                 # FastAPI entry point (Backend)
├── index.html             # User Interface (Frontend)
├── cli.py                 # Command Line Interface tool
├── batch_cli.py           # Batch processing tool
├── backend/
│   └── core/
│       └── score.py       # Core risk logic algorithms
└── requirements.txt       # Dependencies
