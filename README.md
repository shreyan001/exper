
# Exper

## Description

Exper is a revolutionary platform leveraging community-curated AI models and deployed on the UBIT chain. It transforms how users access, share, and monetize research documents and valuable data through a decentralized, prepay model, eliminating traditional paywalls and subscriptions.

## Features

- **Community-Curated AI Models:** Expert-driven AI models tailored for finance, healthcare, and education.
- **Decentralized Data Access:** Prepay for specific data access, promoting affordability and flexibility.
- **UBIT Chain Integration:** Secure transactions and governance leveraging UBIT's DeFi ecosystem.
- **DAO Governance:** Community-driven decision-making through ExperDAO for model curation and platform governance.

## Installation and Usage

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/exper.git
   cd exper
   yarn
   ```

2. Set up environment variables:
   - Go to the .env.example file
   - Add necessary environment variables (e.g., API keys, configuration settings).

3. Start the development server:
   ```bash
   yarn dev
   ```

### Smart Contract Deployment

- **ExperPayments (Treasury):** [0x00897Acc92715d095D120e10f42eC4Da9808440f](https://testnet.ubitscan.io/address/0x00897Acc92715d095D120e10f42eC4Da9808440f/read-contract#address-tabs)
- **ExperDAO:** [0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5](https://testnet.ubitscan.io/address/0x5AfA5a5268D6621546ad2e04957F7113bA1CbBC5/contracts#address-tabs)

## Quick Links

- **Website:** [https://exper-nine.vercel.app/](https://exper-nine.vercel.app/)
- **GitHub Repository:** [https://github.com/yourusername/exper](https://github.com/yourusername/exper)

## Contributing

Please follow our [contribution guidelines](CONTRIBUTING.md) to contribute to the development of Exper. We welcome all contributions from the community.

## Expert Community-Curated AI Models and Tacit Knowledge

Exper leverages expert community-curated AI models to address the complexities of tacit knowledge:

1. **Enhanced Knowledge Discovery:**
   - Utilizes machine learning algorithms and NLP to uncover hidden patterns and insights.
   - Analyzes unstructured data.

2. **Optimized Decision-Making:**
   - AI-powered systems analyze tacit knowledge to identify best practices and potential bottlenecks.

3. **Facilitated Innovation:**
   - Stimulates innovation through collaborative efforts and idea-sharing.

4. **Knowledge Management and Transfer:**
   - Enhances knowledge management practices for effective transfer within organizations.

## Visual Flowchart Generator

### User POV:

#### User Access:

- User navigates to /chat on the Exper dApp.
- A popup suggests prepaying to access AI models.

#### Prepayment Process:

- User interacts with a treasury smart contract to prepay for access.
- Funds are securely transferred to the treasury.

#### AI Model Interaction:

- Behind the scenes, a RAG model (Reformulated Advisory Group) is employed.
- Vector store fetches appropriate embeddings for user queries.

### Data Contributor:

#### Onboarding:

- Data contributor visits /onboard page.
- Submits name, email, and description.

#### ExperDAO Verification:

- ExperDAO verifiers review and approve the membership application.
- Contributor is whitelisted to mint a DAO NFT pass.

#### NFT Minting:

- Contributor mints a DAO NFT pass used for token gating and voting within the DAO.

#### Data Contribution:

- Contributor submits data for inclusion in the RAG model.
- Data undergoes approval processes to ensure quality and relevance.

#### Data Processing:

- Approved data is split and converted into vector embeddings.
- Embeddings are processed using Mistral for LLM (Large Language Model) and BERT for embeddings.

#### Data Storage:

- Vector embeddings are stored in Vectorstore, facilitated by Supabase.
- Smart contracts manage data transactions and interactions on the UBIT chain.
