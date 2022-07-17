//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";

contract Stolid is Pausable {
    
    constructor() {
        
        chiefJustice = msg.sender;
    }


    function pause() public onlyChiefJustice {
        _pause();
    }

    function unpause() public onlyChiefJustice {
        _unpause();
    }

    

    uint fileId;

    address public chiefJustice;

    uint exhibitId;

    mapping(uint => CaseFile) public allCaseFiles;

    mapping(address => bool) public judges;

    mapping(address => bool) public registrars;

    modifier onlyRegistrars(address _user) {
        bool isRegistrar = registrars[_user];
        require(isRegistrar, "Only Registrars Have Access!");
        _;
    }

    modifier onlyChiefJustice() {
        require(
            msg.sender == chiefJustice,
            "Only The Chief Justice Have Access!"
        );
        _;
    }
    struct CaseFile {
        uint id;
        string caseId;
        string fileHash;
        address judge;
        address clerk;
        bool active;
        string[] caseExhibits;
    }

    event CaseCreated(address indexed creator, string caseId, uint time);
    event CaseEnded(address indexed judge, string caseId, uint time);

    function createCase(
        string memory _caseId,
        string memory _fileHash,
        address _judge,
        address _clerk,
        string[] calldata _exhibits
    ) public whenNotPaused {
        require(
            registrars[msg.sender] || msg.sender == chiefJustice,
            "only Registrars and chief Justices can create files"
        );
        require(bytes(_caseId).length > 0, "invalid case ID");
        require(bytes(_fileHash).length > 0, "invalid FIle");
        require(_judge != address(0), "invalid contract address");
        require(_clerk != address(0), "invalid contract address");
        require(_exhibits.length > 0, " please attach exhibit(s)");

        fileId++;

        allCaseFiles[fileId] = CaseFile(
            fileId,
            _caseId,
            _fileHash,
            _judge,
            _clerk,
            true,
            _exhibits
        );

        emit CaseCreated(msg.sender, _caseId, block.timestamp);
    }

    function addExhibits(string[] calldata _exhibit, uint _id)
        public
        whenNotPaused
    {
        require(
            allCaseFiles[_id].active,
            "you cannot manipulate a closed case"
        );
        require(
            msg.sender == allCaseFiles[_id].judge ||
                msg.sender == allCaseFiles[_id].clerk,
            "only assigned judge or clerk can add exhibits"
        );
        for (uint i = 0; i < _exhibit.length; i++) {
            allCaseFiles[_id].caseExhibits.push(_exhibit[i]);
        }
    }

    function updateCase(uint _id, string memory _filehash)
        public
        whenNotPaused
    {
        require(
            allCaseFiles[_id].active,
            "you cannot manipulate a closed case"
        );
        require(
            msg.sender == allCaseFiles[_id].judge ||
                msg.sender == allCaseFiles[_id].clerk,
            "only assigned judge or clerk can add exhibits"
        );

        allCaseFiles[_id].fileHash = _filehash;
    }

    function reassignCase(
        uint _id,
        address newJudge,
        address newClerk
    ) public whenNotPaused onlyChiefJustice {
        allCaseFiles[_id].judge = newJudge;
        allCaseFiles[_id].clerk = newClerk;
    }

    function endCase(uint _id) public whenNotPaused {
        require(
            allCaseFiles[_id].active,
            "you cannot manipulate a closed case"
        );
        require(
            msg.sender == allCaseFiles[_id].judge,
            "only assigned judge can close case"
        );

        allCaseFiles[_id].active = false;

        emit CaseEnded(msg.sender, allCaseFiles[_id].caseId, block.timestamp);
    }

    function addRegistrar(address newRegistrar)
        public
        whenNotPaused
        onlyChiefJustice
    {
        registrars[newRegistrar] = true;
    }

    function removeRegistrar(address _registrar)
        public
        whenNotPaused
        onlyChiefJustice
    {
        registrars[_registrar] = false;
    }

    /// @notice remove an existing moderator
    function removeChiefJustice(address newChiefJustice)
        public
        whenNotPaused
        onlyChiefJustice
    {
        chiefJustice = newChiefJustice;
    }

    function closedCases() public view returns (CaseFile[] memory) {
        uint currentIndex = 0;

        CaseFile[] memory closed = new CaseFile[](fileId);
        for (uint i = 0; i < fileId; i++) {
            if (allCaseFiles[i + 1].active == false) {
                uint currentId = allCaseFiles[i + 1].id;
                CaseFile storage currentCase = allCaseFiles[currentId];
                closed[currentIndex] = currentCase;
                currentIndex += 1;
            }
        }
        return closed;
    }

    function caseAssignedToJudge() public view returns (CaseFile[] memory) {
        uint currentIndex = 0;
        CaseFile[] memory cases = new CaseFile[](fileId);
        for (uint i = 0; i < fileId; i++) {
            if (allCaseFiles[i + 1].active == true) {
                if (allCaseFiles[i + 1].judge == msg.sender) {
                    uint currentId = allCaseFiles[i + 1].id;
                    CaseFile storage currentCase = allCaseFiles[currentId];
                    cases[currentIndex] = currentCase;
                    currentIndex += 1;
                }
            }
        }
        return cases;
    }

    function caseAssignedToClerk() public view returns (CaseFile[] memory) {
        uint currentIndex = 0;
        CaseFile[] memory cases = new CaseFile[](fileId);
        for (uint i = 0; i < fileId; i++) {
            if (allCaseFiles[i + 1].active == true) {
                if (allCaseFiles[i + 1].clerk == msg.sender) {
                    uint currentId = allCaseFiles[i + 1].id;
                    CaseFile storage currentCase = allCaseFiles[currentId];
                    cases[currentIndex] = currentCase;
                    currentIndex += 1;
                }
            }
        }
        return cases;
    }
}
