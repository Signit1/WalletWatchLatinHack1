// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VerificationNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    // Estructura para almacenar datos de verificación
    struct VerificationData {
        string walletAddress;
        string riskLevel;
        string riskProfile;
        uint256 verificationDate;
        string polkadotAddress;
        bool isVerified;
    }

    // Mapeo de token ID a datos de verificación
    mapping(uint256 => VerificationData) public verifications;
    
    // Mapeo de wallet a token ID (para evitar duplicados)
    mapping(string => uint256) public walletToToken;
    
    // Base URI para metadatos
    string private _baseTokenURI;
    
    // Eventos
    event VerificationMinted(
        uint256 indexed tokenId,
        string walletAddress,
        string riskLevel,
        string polkadotAddress
    );

    constructor() ERC721("Wallet Verification Certificate", "WVC") {
        _baseTokenURI = "https://api.walletwatch.com/metadata/";
    }

    // Función para mintear NFT de verificación
    function mintVerification(
        address to,
        string memory walletAddress,
        string memory riskLevel,
        string memory riskProfile,
        string memory polkadotAddress
    ) public onlyOwner returns (uint256) {
        // Verificar que la wallet no tenga ya un NFT
        require(walletToToken[walletAddress] == 0, "Wallet already verified");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Crear datos de verificación
        VerificationData memory verification = VerificationData({
            walletAddress: walletAddress,
            riskLevel: riskLevel,
            riskProfile: riskProfile,
            verificationDate: block.timestamp,
            polkadotAddress: polkadotAddress,
            isVerified: true
        });
        
        verifications[tokenId] = verification;
        walletToToken[walletAddress] = tokenId;
        
        _safeMint(to, tokenId);
        
        emit VerificationMinted(tokenId, walletAddress, riskLevel, polkadotAddress);
        
        return tokenId;
    }

    // Función para obtener datos de verificación
    function getVerificationData(uint256 tokenId) public view returns (VerificationData memory) {
        require(_exists(tokenId), "Token does not exist");
        return verifications[tokenId];
    }

    // Función para verificar si una wallet ya está verificada
    function isWalletVerified(string memory walletAddress) public view returns (bool) {
        return walletToToken[walletAddress] != 0;
    }

    // Función para obtener token ID de una wallet
    function getTokenIdByWallet(string memory walletAddress) public view returns (uint256) {
        return walletToToken[walletAddress];
    }

    // Función para actualizar base URI
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Función para obtener base URI
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Función para obtener metadatos del token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        VerificationData memory data = verifications[tokenId];
        
        // Crear metadatos JSON
        string memory json = string(abi.encodePacked(
            '{"name": "Wallet Verification Certificate #', tokenId.toString(), '",',
            '"description": "Certificate of wallet verification and risk assessment",',
            '"image": "https://api.walletwatch.com/images/verification-certificate.png",',
            '"attributes": [',
            '{"trait_type": "Wallet Address", "value": "', data.walletAddress, '"},',
            '{"trait_type": "Risk Level", "value": "', data.riskLevel, '"},',
            '{"trait_type": "Risk Profile", "value": "', data.riskProfile, '"},',
            '{"trait_type": "Verification Date", "value": "', data.verificationDate.toString(), '"},',
            '{"trait_type": "Polkadot Address", "value": "', data.polkadotAddress, '"},',
            '{"trait_type": "Verified", "value": "', data.isVerified ? "true" : "false", '"}',
            ']}'
        ));
        
        return string(abi.encodePacked("data:application/json;base64,", 
            _encodeBase64(bytes(json))));
    }

    // Función auxiliar para codificar en base64
    function _encodeBase64(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";
        
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        string memory result = new string(4 * ((data.length + 2) / 3));
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let i := 0
            } lt(i, mload(data)) {
                i := add(i, 3)
            } {
                let input := and(mload(add(data, add(32, i))), 0xffffff)
                
                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF))
                out := shl(8, out)
                out := add(out, and(mload(add(tablePtr, and(input, 0x3F))), 0xFF))
                out := shl(224, out)
                
                mstore(resultPtr, out)
                
                resultPtr := add(resultPtr, 4)
            }
            
            switch mod(mload(data), 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }
        }
        
        return result;
    }

    // Función para obtener el total de tokens minteados
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
