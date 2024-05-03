// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MetaChat {
    struct User {
        string name;
        Friend[] friends;
    }

    struct Friend {
        address pubkey;
        string name;
    }

    struct Chat {
        address sender;
        uint256 timestamp;
        string message;
    }

    struct AllUsers {
        string name;
        address accountAddress;
    }

    event ChatSent(bytes32 indexed chatCode, address indexed _from, address indexed _to);

    AllUsers[] getAllUsers;

    mapping(address => User) userList;
    mapping(bytes32 => Chat[]) chats;

    function checkUserExists(address pubkey) public view returns(bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    function createAccount(string calldata name) external {
        require(checkUserExists(msg.sender) == false, "User already exists");
        require(bytes(name).length > 0, "Username cannot be empty");

        userList[msg.sender].name = name;

        getAllUsers.push(AllUsers(name, msg.sender));
    }

    function getUsername(address pubkey) external view returns(string memory) {
        require(checkUserExists(pubkey), "User is not registered!");
        return userList[pubkey].name;
    }

    function addFriend(address friendKey, string calldata name) external {
        require(checkUserExists(msg.sender), "Create an account");
        require(checkUserExists(friendKey), "User not recognized");
        require(msg.sender != friendKey, "Cannot add yourself as a friend");
        require(checkAlreadyFriends(msg.sender, friendKey) == false, "Already a friend!");

        _addFriend(msg.sender, friendKey, name);
        _addFriend(friendKey, msg.sender, userList[msg.sender].name);
    }

    function checkAlreadyFriends(address pubKey1, address pubKey2) internal view returns(bool) {
        if(userList[pubKey1].friends.length > userList[pubKey2].friends.length) {
            address temp = pubKey1;
            pubKey1 = pubKey2;
            pubKey2 = temp;
        }

        for(uint256 i = 0; i < userList[pubKey1].friends.length; i++) {
            if(userList[pubKey1].friends[i].pubkey == pubKey2) return true;
        }
        return false;
    }

    function _addFriend(address reciever, address sender, string memory name) internal {
        Friend memory newFriend = Friend(sender, name);
        userList[reciever].friends.push(newFriend);
    }

    function getFriendsList() external view returns(Friend[] memory) {
        return userList[msg.sender].friends;
    }

    function _getChatCode(address pubkey1, address pubkey2) internal pure returns(bytes32) {
        if(pubkey1 < pubkey2) {
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        } else return keccak256(abi.encodePacked(pubkey2, pubkey1));
    }

    function sendMessage(address friendKey, string calldata _msg) external {
        require(checkUserExists(msg.sender), "Create an account");
        require(checkUserExists(friendKey), "User is not registered!");
        require(checkAlreadyFriends(msg.sender, friendKey), "You are not friend with this user");

        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        Chat memory newChat = Chat(msg.sender, block.timestamp, _msg);
        chats[chatCode].push(newChat);
        emit ChatSent(chatCode, msg.sender, friendKey);
    }

    function readChat(address friendKey) external view returns(Chat[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friendKey);
        return chats[chatCode];
    }

    function getAllRegisteredUsers() public view returns(AllUsers[] memory) {
        return getAllUsers;
    }
}