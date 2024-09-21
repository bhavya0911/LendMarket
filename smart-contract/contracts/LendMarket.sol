//SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendMarket {

    struct listing {
        address borrower;
        address lender;
        address borrow_token;
        address loan_token;
        uint256 borrow_amount;
        uint256 loan_amount;
        uint256 repay_amount;
        uint256 startTimestamp;
        uint256 duration;
        uint8 status;
        bytes32 seed;
    }

    struct message {
        address maker;
        bool typeOf;
        address borrow_token;
        address loan_token;
        uint256 borrow_amount;
        uint256 loan_amount;
        uint256 repay_amount;
        uint256 duration;
        bytes32 seed;
    }

    mapping(bytes32 => listing) seed;

    constructor() {}

    function accept(listing memory list, bytes memory signature) external payable {
        bool typeOf = msg.sender == list.borrower ? true : false;
        require(list.status == 1, "Wrong status code");
        require(verifyListing(createMessage(creatingMessage(list, typeOf)), signature, msg.sender), "Cannot verify list");
        require(seed[list.seed].status == 0, "Already used seed");

        seed[list.seed] = list;

        if (typeOf) {
            bool success;
            (success) = IERC20(list.borrow_token).transferFrom(msg.sender, address(this), list.borrow_amount);
            require(success, "Transfer failed");
            (success) = IERC20(list.loan_token).transferFrom(list.lender, msg.sender, list.loan_amount);
            require(success, "Transfer failed");
        } else {
            bool success;
            (success) = IERC20(list.borrow_token).transferFrom(list.lender, address(this), list.borrow_amount);
            require(success, "Transfer failed");
            (success) = IERC20(list.loan_token).transferFrom(msg.sender, list.borrower, list.loan_amount);
            require(success, "Transfer failed");
        }
    }

    function repay(bytes32 _seed) external payable {
        listing storage list = seed[_seed];
        require(list.borrower == msg.sender, "Not authorised to repay");
        require(list.status == 1, "Cannot repay given listing");
        require(list.startTimestamp + list.duration >= block.timestamp, "Repay time expired");

        list.status = 2;

        bool success;
        (success) = IERC20(list.loan_token).transferFrom(msg.sender, list.lender, list.repay_amount);
        require(success, "Transfer failed");
        (success) = IERC20(list.borrow_token).transferFrom(address(this), msg.sender, list.borrow_amount);
        require(success, "Transfer failed");
    }

    function reclaim(bytes32 _seed) external payable {
        listing memory list = seed[_seed];
        require(list.lender == msg.sender, "Not authorised to reclaim");
        require(list.status == 1, "Cannot reclaim given listing");
        require(list.startTimestamp + list.duration <= block.timestamp, "Repay time has not expired");

        list.status = 2;

        bool success;
        (success) = IERC20(list.borrow_token).transferFrom(address(this), msg.sender, list.borrow_amount);
        require(success, "Transfer failed");
    }

    function cancel(listing memory list, bytes memory signature) external payable {
        bool typeOf = msg.sender == list.borrower ? true : false;
        require(verifyListing(createMessage(creatingMessage(list, typeOf)), signature, msg.sender), "Cannot verify list");
        require(seed[list.seed].status == 0 && list.status == 3, "Already used seed");

        seed[list.seed] = list;
    }

    function creatingMessage(listing memory list, bool typeOf) internal view returns (message memory newMessage) {
        newMessage = message (
            msg.sender,
            typeOf,
            list.borrow_token,
            list.loan_token,
            list.borrow_amount,
            list.loan_amount,
            list.repay_amount,
            list.duration,
            list.seed
        );   
    }

    function createMessage(message memory _message) internal pure returns (bytes32 hashMessage) {
        hashMessage = keccak256(abi.encodePacked(
            "Maker is: ",
            _message.maker,
            " typeOf: ",
            _message.typeOf,
            " borrow_token: ",
            _message.borrow_token,
            " loan_token: ",
            _message.loan_token,
            " borrow_amount: ",
            _message.borrow_amount,
            " loan_amount: ",
            _message.loan_amount,
            " repay_amount: ",
            _message.repay_amount,
            " duration: ",
            _message.duration,
            " seed: ",
            _message.seed
        ));
    }

    function verifyListing(bytes32 hashMessage, bytes memory signature, address sender) internal pure returns (bool) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);
        bytes32 hash = getEthSignedMessageHash(hashMessage);

        address recoveredAddress = ecrecover(hash, v, r, s);

        return (recoveredAddress == sender);
    }

    function splitSignature(bytes memory signature) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(signature.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        if (v < 27) {
            v +=27;
        }
    }

    function getEthSignedMessageHash(bytes32 messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            messageHash
        ));
    }   
}