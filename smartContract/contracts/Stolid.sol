//SPDX-License-Identifier: MIT
	pragma solidity ^0.8.0;
	

	import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
	import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
	import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
	
 /// @author Hamid Adewuyi
/// @title A Decentralized workspace and file management system

	contract Stolid is Initializable, PausableUpgradeable, UUPSUpgradeable {
	    /// @custom:oz-upgrades-unsafe-allow constructor
	    constructor() {
	        _disableInitializers();
	    }
	
/// @notice initial function that would run during deployment
	    function initialize() public initializer {
	        chiefJustice = msg.sender;
	        __Pausable_init();
	        __UUPSUpgradeable_init();
	    }
	

///@dev variable to track number of files created
///@notice number of files created
	    uint fileId;
	
///@notice address of chief justice
	    address public chiefJustice;
	
	
///@notice list of all case files created
	    mapping(uint => CaseFile) public allCaseFiles;
	
///@notice list of all registrars created
	    mapping(address => bool) public registrars;
	
///@notice modifier to restrice access to only registrars
	    modifier onlyRegistrars(address _user) {
	        bool isRegistrar = registrars[_user];
	        require(isRegistrar, "Only Registrars Have Access!");
	        _;
	    }
	
///@notice modifier to restrice access to only chief justice
	    modifier onlyChiefJustice() {
	        require(
	            msg.sender == chiefJustice,
	            "Only The Chief Justice Have Access!"
	        );
	        _;
	    }
      
 ///@notice components of a case file
	    struct CaseFile {
	        uint id;
	        string caseId;
	        string fileHash;
	        address judge;
	        address clerk;
	        bool active;
	        string[] caseExhibits;
	    }
	
///========================== EVENTS =================================
	    event CaseCreated(address indexed creator, string caseId, uint time);
	    event CaseEnded(address indexed judge, string caseId, uint time);
	
/// @notice function to create a new case
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
	
/// @notice function to  add exhibits
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
	
/// @notice function to update case file
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
	
/// @notice function to create a re-assign case

	    function reassignCase(
	        uint _id,
	        address newJudge,
	        address newClerk
	    ) public whenNotPaused onlyChiefJustice {
	        allCaseFiles[_id].judge = newJudge;
	        allCaseFiles[_id].clerk = newClerk;
	    }
	
/// @notice function to close case

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
	
/// @notice function to add a new registrar

	    function addRegistrar(address newRegistrar)
	        public
	        whenNotPaused
	        onlyChiefJustice
	    {
	        registrars[newRegistrar] = true;
	    }
	
/// @notice function to remove a registrar

	    function removeRegistrar(address _registrar)
	        public
	        whenNotPaused
	        onlyChiefJustice
	    {
	        registrars[_registrar] = false;
	    }
	

	    /// @notice remove an existing chiefJustice
	    function removeChiefJustice(address newChiefJustice)
	        public
	        whenNotPaused
	        onlyChiefJustice
	    {
	        chiefJustice = newChiefJustice;
	    }
	
/// @notice function to view all closed cases
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
	
/// @notice function to view all cases assigned to judge
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
	
/// @notice function to view all cases assigned to clerks
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
        
      /// @notice function to pause contract
	    function pause() public onlyChiefJustice {
	        _pause();
	    }
	
 /// @notice function to unpause contract
	    function unpause() public onlyChiefJustice {
	        _unpause();
	    }
	
 /// @notice function to upgrade contract
	    function _authorizeUpgrade(address newImplementation)
	        internal
	        override
	        onlyChiefJustice
	    {}
	
	}

