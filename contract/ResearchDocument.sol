// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResearchDocumentMarket {
  // Structure to represent a document
  struct Document {
    address author;
    uint256 pricePerWord;
    uint256 totalWords;
    mapping(address => uint256) payments; // Track payments made by each user for the document
  }

  // Mapping from document hash to Document
  mapping(bytes32 => Document) public documents;

  // Mapping from author address to their earnings
  mapping(address => uint256) public authorEarnings;

  // Event to log document upload
  event DocumentUploaded(bytes32 indexed docHash, address indexed author, uint256 pricePerWord, uint256 totalWords);

  // Event to log document access payment
  event DocumentAccessPayment(bytes32 indexed docHash, address indexed user, uint256 amountPaid);

  // Function to upload a document
  function uploadDocument(bytes32 docHash, uint256 _pricePerWord, uint256 _totalWords) external {
    require(documents[docHash].author == address(0), "Document already exists");

    // Initialize a new Document
    Document storage newDocument = documents[docHash];
    newDocument.author = msg.sender;
    newDocument.pricePerWord = _pricePerWord;
    newDocument.totalWords = _totalWords;

    emit DocumentUploaded(docHash, msg.sender, _pricePerWord, _totalWords);
  }

  // Function to access a document (user sends any amount)
  function accessDocument(bytes32 docHash) external payable {
    Document storage document = documents[docHash];
    require(document.author != address(0), "Document does not exist");

    // Update user's payment record
    document.payments[msg.sender] += msg.value;

    // Emit event
    emit DocumentAccessPayment(docHash, msg.sender, msg.value);
  }

  // Function for authors to withdraw earnings
  function withdrawEarnings() external {
    uint256 amount = authorEarnings[msg.sender];
    require(amount > 0, "No earnings to withdraw");

    // Reset author's earnings
    authorEarnings[msg.sender] = 0;

    // Transfer earnings to author
    payable(msg.sender).transfer(amount);
  }
}
