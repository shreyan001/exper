// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/utils/Counters.sol";

contract DAOSmartContract is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;

    struct UserDetails {
        string name;
        string email;
        bool isMember;
        uint256 earnings;
    }

    mapping(address => UserDetails) public daoUsers;
    mapping(address => bool) public verifiers;

    address public treasury;

    event EarningsUpdated(address user, uint256 amount);

    constructor(address _treasury) ERC721("DAONFT", "DNFT") {
        treasury = _treasury;
        transferOwnership(msg.sender); // Ensure deployer is the owner
    }

    // Join DAO
    function joinDAO(string memory name, string memory email) public {
        require(!daoUsers[msg.sender].isMember, "Already a DAO member");
        daoUsers[msg.sender] = UserDetails(name, email, true, 0);
    }

    // Add Verifier
    function addVerifier(address verifier) public onlyOwner {
        verifiers[verifier] = true;
    }

    // Mint NFT
    function mintNFT() public {
        require(daoUsers[msg.sender].isMember, "Only DAO members can mint NFT");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
    }

    // Update User Earnings
    function updateUserEarnings(address user, uint256 amount) public onlyOwner {
        require(daoUsers[user].isMember, "User is not a DAO member");
        daoUsers[user].earnings += amount;
        emit EarningsUpdated(user, amount);
    }

    // Claim Earnings
    function claimEarnings() public {
        require(daoUsers[msg.sender].isMember, "Only DAO members can claim earnings");
        uint256 earnings = daoUsers[msg.sender].earnings;
        require(earnings > 0, "No earnings to claim");
        daoUsers[msg.sender].earnings = 0;
        payable(msg.sender).transfer(earnings);
    }

    // Check User Earnings
    function checkEarnings(address user) public view returns (uint256) {
        require(daoUsers[user].isMember, "User is not a DAO member");
        return daoUsers[user].earnings;
    }

    // Withdraw funds from Treasury
    function withdrawFromTreasury(address payable recipient, uint256 amount) public onlyOwner {
        Treasury(treasury).withdraw(recipient, amount);
    }

    // Transfer Ownership
function transferOwnership(address newOwner) public override onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner(), newOwner);
        _transferOwnership(newOwner);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}

interface Treasury {
    function withdraw(address payable recipient, uint256 amount) external;
}
