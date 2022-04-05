// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CryptoBaby is ERC721URIStorage, Ownable {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public ethMinPrice = 0.05 ether;
    uint256 public ethWhitePrice = 0.02 ether;
    uint256 public totalSupply;
    uint256 public maxSupply = 1000;
    uint256 public maxWalletCount = 10;
    bool public isSaleOpen = false;
    bool public isMintEnabled = true;
    bool public isPublicMintEnabled = false;
    string baseURI = "";
    uint256 private _antibotInterval = 3600;
    uint256 private _mintIndexForSale = 1;
    mapping(address => bool) private _whiteList;
    mapping(address => uint256) private _mintedWallet;
    mapping (address => uint256) private _lastCallBlockNumber;

    constructor() ERC721("Crypto baby", "CRYPTOBABY") {}

    function tokenURI(uint256 tokenId) public view override returns(string memory){
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
          ? string(abi.encodePacked(currentBaseURI, Strings.toString(tokenId), ".json"))
          : "";
    }
    
    function _baseURI() internal view override returns (string memory) {
      return baseURI;
    }
    
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
      baseURI = _newBaseURI;
    }
    
    function mint(address recipient, uint256 tokenId) internal {
        require(!_exists(tokenId), "token id already minted");
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI(tokenId));
        _mintedWallet[recipient]++;
        _tokenIds.increment();
    }

    function publicMint(uint256 requestedCount) external payable{
        require(isPublicMintEnabled, "public mint is not enabled");
        require(requestedCount>0 && requestedCount <3, "requested count can not be zero or more than 2");
        require(_lastCallBlockNumber[msg.sender].add(_antibotInterval) < block.number, "you should mint after an hour since you make last mint");
        require(balanceOf(msg.sender) + requestedCount <= maxWalletCount, "Exceed max amount per person");
        require(msg.value >= ethMinPrice.mul(requestedCount), "Not enough ether");

        for(uint256 i = 0; i < requestedCount; i++) {
            if(!_exists(_mintIndexForSale))
            {
                mint(msg.sender, _mintIndexForSale);
            }
            _mintIndexForSale = _mintIndexForSale.add(1);
        }
        _lastCallBlockNumber[msg.sender] = block.number;
    }

    function whiteListMint(uint256[] calldata tokenIds) external payable{
        require(_whiteList[msg.sender], "you are not in white list");
        require(msg.value >= ethWhitePrice.mul(tokenIds.length), "Not enough ether");
        require(_lastCallBlockNumber[msg.sender].add(_antibotInterval) > block.number, "you should mint after an hour since you make last mint");
        require(balanceOf(msg.sender)+tokenIds.length <= maxWalletCount, "Exceed max amount per person");
        require(tokenIds.length > 0 && tokenIds.length < 3, "requested count can not be zero or more than 2");
        for(uint256 i = 0; i < tokenIds.length; i++) {
            require(tokenIds[i] <= maxSupply, "id must be in supply range");
        }
        for(uint256 i = 0; i < tokenIds.length; i++) {
            if(!_exists(tokenIds[i]))
                mint(msg.sender, tokenIds[i]);
            _mintIndexForSale = _mintIndexForSale.add(1);
        }
        _lastCallBlockNumber[msg.sender] = block.number;

    }

    function airdropNFT(address recipient, uint256 tokenId)
        public onlyOwner
    {
        require(recipient != address(0), "Null address found");
        require(isMintEnabled, "minting is not enabled");
        require(maxSupply>totalSupply, "sold out");
        require(maxWalletCount > _mintedWallet[recipient], "the recipient has enough wallet");
        require(_whiteList[recipient], "the recipient is invalid");
        
        mint(recipient, tokenId);
    }

    modifier saleIsOpen {
        if (msg.sender != owner()) {
            require(isSaleOpen, "Sale is not open");
        }
        _;
    }

    function _totalSupply() internal view returns (uint) {
        return _tokenIds.current();
    }

    function totalMint() public view returns (uint256) {
        return _totalSupply();
    }

    function setMaxSupply(uint _maxSupply) external onlyOwner{
        maxSupply = _maxSupply;
    }

    function setMaxWalletCount(uint _maxWallet) external onlyOwner{
        maxWalletCount = _maxWallet;
    }

    function setPriceInWei(uint256 _price) external onlyOwner{
        ethMinPrice = _price;
    }

    function addToWhitelist(address[] calldata addresses) external onlyOwner{
         for (uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Null address found");
            _whiteList[addresses[i]] = true;
        }
    }

    function checkInWhiteList(address addr) external view onlyOwner returns (bool) {
        return _whiteList[addr];
    }

    function removeFromWhiteList(address[] calldata addresses) external onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Null address found");

            _whiteList[addresses[i]] = false;
        }
    }

    function setSaleOpen(bool _isSaleOpen) external onlyOwner{
        isSaleOpen = _isSaleOpen;
    }

    function setMintEnabled(bool _isEnabled) external onlyOwner{
        isMintEnabled = _isEnabled;
    }

    function setPublicMintEnabled(bool _isEnabled) external onlyOwner{
        isPublicMintEnabled = _isEnabled;
    }

    function getMintPrice() external view returns (uint256) {
        return ethMinPrice;
    }

    function getWhiteMintPrice() external view returns (uint256) {
        return ethWhitePrice;
    }

}
