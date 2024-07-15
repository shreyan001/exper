// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract Treasury {
    address public daoContract;
    uint256 public constant FEE = 500000000000000; // 0.0005 ETH in wei

    event PaymentReceived(address from, uint256 amount);
    event DAOContractUpdated(address newDAOContract);

    modifier onlyDAO() {
        require(msg.sender == daoContract, "Only the DAO contract can call this function.");
        _;
    }

    modifier onlyOnce() {
        require(daoContract == address(0), "DAO contract address can only be set once.");
        _;
    }

    // Set DAO contract address
    function setDAOContract(address _daoContract) public onlyOnce {
        daoContract = _daoContract;
        emit DAOContractUpdated(_daoContract);
    }

    // Accept payments of a fixed fee
    function makePayment() public payable {
        require(msg.value == FEE, "Incorrect payment amount. The fee is 0.0005 ETH.");
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Withdraw funds to a specified address
    function withdraw(address payable recipient, uint256 amount) public onlyDAO {
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
    }

    // Check contract balance
    function checkBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Fallback function to accept ETH sent directly to the contract
    receive() external payable {
        require(msg.value == FEE, "Incorrect payment amount. The fee is 0.0005 ETH.");
        emit PaymentReceived(msg.sender, msg.value);
    }
}
