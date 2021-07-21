const Mayor = artifacts.require("Mayor");
const SULToken = artifacts.require("SULToken");
const ethers = require("ethers");
const truffleAssert = require('truffle-assertions');

contract("Mayor", accounts => {
    const escrow = accounts[0]

    describe("Testing Mayor contract functions", () => {

        it("...should deploy, and fail to call the constructor with empty list of candidates", async () => {
            truffleAssert.fails(Mayor.new([], escrow, 2));          
        })

        it("...should deploy, and successfully call the constructor", async () => {
            const SULTokenInstance = await SULToken.new(1000);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
                        
            assert(mayorInstance);          
        })

        it("...should successfully register the voter", async () => {
            const voter = accounts[9]
            const SULTokenInstance = await SULToken.deployed();
            const mayorInstance = await Mayor.deployed();

            const initialMayorBalance = await SULTokenInstance.balanceOf(mayorInstance.address);
            const tx = await mayorInstance.register({from: voter});
            const currentMayorBalance = await SULTokenInstance.balanceOf(mayorInstance.address);
            const voterBalance = await SULTokenInstance.balanceOf(voter);

            assert.equal(voterBalance, initialMayorBalance - currentMayorBalance, "the");
            truffleAssert.eventEmitted(tx, "Registered");
        })

        it("...should successfully compute the envelope", async () => {
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);
            
            const voter = accounts[9]
            await mayorInstance.register({from: voter});
            const computedEnvelope = await mayorInstance.compute_envelope(872134, accounts[1], 30);
            const rightEnvelope = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint", "address", "uint"], [872134, accounts[1], 30]));
            
            assert.equal(computedEnvelope, rightEnvelope);          
        })
        
        it("...should successfully cast the envelope", async () => {
            const voter = accounts[9]
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);
            
            await mayorInstance.register({from: voter});
            const computedEnvelope = await mayorInstance.compute_envelope(872134, accounts[1], 30);

            const output = await mayorInstance.cast_envelope(computedEnvelope, {from: voter})
            truffleAssert.eventEmitted(output, "EnvelopeCast");  
        })

        it("...should fail to open the envelope because quorum is not reached", async () => {
            const voter = accounts[9];
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);
            await mayorInstance.register({from: voter});
            const computedEnvelope = await mayorInstance.compute_envelope(872134, accounts[1], 30);
            const castedEnvelope = await mayorInstance.cast_envelope(computedEnvelope, {from: voter})
            
            truffleAssert.fails(mayorInstance.open_envelope(872134, accounts[1], {from: voter, value:30}));  
        });

        it("...should successfully open the envelope", async () => {
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);

            // Vote 1
            const voter1 = accounts[9];
            await mayorInstance.register({from: voter1});
            const computedEnvelope1 = await mayorInstance.compute_envelope(872134, accounts[1], 30);
            const castedEnvelope1 = await mayorInstance.cast_envelope(computedEnvelope1, {from: voter1})

            // Vote 2
            const voter2 = accounts[8];
            await mayorInstance.register({from: voter2});
            const computedEnvelope2 = await mayorInstance.compute_envelope(123434, accounts[1], 30);
            const castedEnvelope2 = await mayorInstance.cast_envelope(computedEnvelope2, {from: voter2})
            
            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter1});
            const output = await mayorInstance.open_envelope(872134, accounts[1], {from: voter1, value: "30"});
            
            truffleAssert.eventEmitted(output, "EnvelopeOpen");  
        });
    
        it("...should successfully state the mayor victory", async () => {
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);

            // Vote 1
            const voter1 = accounts[9];
            await mayorInstance.register({from: voter1});
            const computedEnvelope1 = await mayorInstance.compute_envelope(872134, accounts[1], 30);
            const castedEnvelope1 = await mayorInstance.cast_envelope(computedEnvelope1, {from: voter1})

            // Vote 2
            const voter2 = accounts[8];
            await mayorInstance.register({from: voter2});
            const computedEnvelope2 = await mayorInstance.compute_envelope(123434, accounts[1], 30);
            const castedEnvelope2 = await mayorInstance.cast_envelope(computedEnvelope2, {from: voter2})
            
            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter1});
            await mayorInstance.open_envelope(872134, accounts[1], {from: voter1, value:30});

            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter2});
            await mayorInstance.open_envelope(123434, accounts[1], {from: voter2, value:30});

            const output = await mayorInstance.mayor_or_sayonara();

            truffleAssert.eventEmitted(output, "NewMayor");  
        });
    
        it("...should successfully state tie", async () => {
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);

            // Vote 1
            const voter1 = accounts[9];
            await mayorInstance.register({from: voter1});
            const computedEnvelope1 = await mayorInstance.compute_envelope(872134, accounts[1], 30);
            const castedEnvelope1 = await mayorInstance.cast_envelope(computedEnvelope1, {from: voter1})

            // Vote 2
            const voter2 = accounts[8];
            await mayorInstance.register({from: voter2});
            const computedEnvelope2 = await mayorInstance.compute_envelope(123434, accounts[2], 30);
            const castedEnvelope2 = await mayorInstance.cast_envelope(computedEnvelope2, {from: voter2})
            
            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter1});
            await mayorInstance.open_envelope(872134, accounts[1], {from: voter1, value:30});

            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter2});
            await mayorInstance.open_envelope(123434, accounts[2], {from: voter2, value:30});

            const output = await mayorInstance.mayor_or_sayonara();
            
            truffleAssert.eventEmitted(output, "Tie");  
        });

        it("...should successfully avoid reentrancy", async () => {
            const initialTokens = 1000;
            const SULTokenInstance = await SULToken.new(initialTokens);
            const mayorInstance = await Mayor.new([accounts[1], accounts[2]], escrow, 2, SULTokenInstance.address);
            await SULTokenInstance.transfer(mayorInstance.address, initialTokens);

            // Vote 1
            const voter1 = accounts[9];
            await mayorInstance.register({from: voter1});
            const computedEnvelope1 = await mayorInstance.compute_envelope(872134, accounts[1], 30);
            const castedEnvelope1 = await mayorInstance.cast_envelope(computedEnvelope1, {from: voter1})

            // Vote 2
            const voter2 = accounts[8];
            await mayorInstance.register({from: voter2});
            const computedEnvelope2 = await mayorInstance.compute_envelope(123434, accounts[1], 30);
            const castedEnvelope2 = await mayorInstance.cast_envelope(computedEnvelope2, {from: voter2})
            
            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter1});
            await mayorInstance.open_envelope(872134, accounts[1], {from: voter1, value:30});
            await SULTokenInstance.approve(mayorInstance.address, 30, {from: voter2});
            await mayorInstance.open_envelope(123434, accounts[1], {from: voter2, value:30});

            await mayorInstance.mayor_or_sayonara();
            await truffleAssert.fails(mayorInstance.mayor_or_sayonara());  
        });
    });

 });