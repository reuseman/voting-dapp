const Web3 = require("web3");
const Mayor = artifacts.require("Mayor");
const SULToken = artifacts.require("SULToken");

function write_contract_addresses(mayor, sul) {
  const fs = require("fs");

  const user = {
    mayor: mayor,
    sul: sul,
  };

  // write JSON string to a file
  fs.writeFile("addresses.json", JSON.stringify(user), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}

module.exports = async function(deployer, network, accounts) {
  // Connect to local instance
  // let web3 = new Web3("http://localhost:8545");
  // // Fetch demo accounts
  // console.log(accounts);
  // const balance = await web3.eth.getBalance(accounts[0]);
  // // console.log("balance", web3.utils.fromWei(balance, "ether"));

  // Fetch contracts
  const mayorContractJSON = require("../build/contracts/Mayor.json");
  const mayorBytecode = mayorContractJSON.bytecode;
  const mayorAbi = mayorContractJSON.abi;

  const SULTokenContractJSON = require("../build/contracts/SULToken.json");
  const SULTokenBytecode = SULTokenContractJSON.bytecode;
  const SULTokenAbi = SULTokenContractJSON.abi;

  // Deploy contracts
  const initialCoins = 100000;
  const candidates = [accounts[0], accounts[1]];
  const escrow = accounts[9];

  await deployer.deploy(SULToken, initialCoins); // const x = await SULToken.deployed();
  const SULTokenIstance = await SULToken.deployed();

  await deployer.deploy(Mayor, candidates, escrow, 1, SULTokenIstance.address);
  const MayorInstance = await Mayor.deployed();

  // Move minted coin over the Mayor contract
  const deployerAddress = deployer.networks[network].from;
  // console.log("DEPLOYER BALANCE: " + await SULTokenIstance.balanceOf(deployerAddress));
  // console.log("MAYOR CONTRACT BALANCE: " + await SULTokenIstance.balanceOf(MayorInstance.address));
  await SULTokenIstance.transfer(MayorInstance.address, initialCoins);
  // console.log("DEPLOYER BALANCE: " + await SULTokenIstance.balanceOf(deployerAddress));
  // console.log("MAYOR CONTRACT BALANCE: " + await SULTokenIstance.balanceOf(MayorInstance.address));
  // console.log("deployer ADDRESS:" + deployerAddress);
  // console.log("sul ADDRESS:" + SULTokenIstance.address);
  // console.log("mayor ADDRESS:" + MayorInstance.address);

  write_contract_addresses(MayorInstance.address, SULTokenIstance.address);
};
