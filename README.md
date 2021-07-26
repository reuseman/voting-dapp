# Peer to Peer and Blockchains assignment
A simple DApp for the elections of a Mayor in the magical land of Valadilène. The vote is possible thanks to the Soul token, an implementation of the ERC20 standard. Contracts are written in Solidity, while the frontend is implemented with Svelte and deployed over [IPFS](https://valadilene.on.fleek.co/).

![](docs/valadilene.gif)

## How to start?
The [doc](docs/final_project.pdf) here contains all the information needed to understand the project. Otherwise you can simply run it by doing the following:

### 1. Deploy the Smart Contracts (backend)

Install the dependencies and optionally run the test to check wheter everything works.

    cd backend/
    npm install
    npm run test

Run an instance of ganache to have a test network on which the contracts can be deployed.

    npm run ganache

Deploy the contracts.

    npm run deploy


### 2. Deploy the DApp (frontend)

You can go over [https://valadilene.on.fleek.co/](https://valadilene.on.fleek.co/) where a deployed version over IPFS can be found. Otherwise you can build it yourself by following the instructions below.

Install the dependencies.

    cd frontend/
    npm install

Compile the frontend with Svelte and go over [http://localhost:5000/](http://localhost:5000/).

    npm run build
    npm run start