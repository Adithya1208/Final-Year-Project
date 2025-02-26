// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AMLContract {
    struct Transaction {
        uint id;
        string transactionId;
        string customerId;
        string customerName;
        string customerAccount;
        string recipientName;
        string recipientAccount;
        uint amount;
        bool flagged;
        uint timestamp;
    }

    uint public transactionCount;
    mapping(uint => Transaction) public transactions;

    event TransactionRecorded(
        uint indexed id,
        string transactionId,
        string customerId,
        string customerName,
        string customerAccount,
        string recipientName,
        string recipientAccount,
        uint amount,
        bool flagged,
        uint timestamp
    );

    function recordTransaction(
        string memory _transactionId,
        string memory _customerId,
        string memory _customerName,
        string memory _customerAccount,
        string memory _recipientName,
        string memory _recipientAccount,
        uint _amount,
        bool _flagged
    ) public {
        transactionCount++;
        transactions[transactionCount] = Transaction(
            transactionCount,
            _transactionId,
            _customerId,
            _customerName,
            _customerAccount,
            _recipientName,
            _recipientAccount,
            _amount,
            _flagged,
            block.timestamp
        );
        emit TransactionRecorded(
            transactionCount,
            _transactionId,
            _customerId,
            _customerName,
            _customerAccount,
            _recipientName,
            _recipientAccount,
            _amount,
            _flagged,
            block.timestamp
        );
    }

    // Optionally, add functions to update the flag later.
    function updateFlag(uint _id, bool _flagged) public {
        require(_id > 0 && _id <= transactionCount, "Transaction does not exist");
        transactions[_id].flagged = _flagged;
    }
}
