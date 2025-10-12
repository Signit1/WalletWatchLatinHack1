// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title VerificationContract
 * @dev Smart contract para verificación de wallets con análisis AML/PLD
 * @author WalletWatch Team
 * @notice Desplegado en Paseo testnet de Polkadot
 */
contract VerificationContract {
    
    // Eventos
    event WalletVerified(
        address indexed walletAddress,
        uint8 riskScore,
        RiskLevel riskLevel,
        bool isSanctioned,
        address indexed verifiedBy,
        uint256 timestamp
    );
    
    event BatchVerificationCompleted(
        uint256 count,
        address indexed verifiedBy,
        uint256 timestamp
    );
    
    // Enums
    enum RiskLevel {
        Low,    // 0
        Medium, // 1
        High    // 2
    }
    
    // Structs
    struct VerificationData {
        uint8 riskScore;
        RiskLevel riskLevel;
        bool isSanctioned;
        uint256 verifiedAt;
        address verifiedBy;
        bool exists;
    }
    
    // Variables de estado
    address public owner;
    mapping(address => VerificationData) public verifications;
    uint256 public totalVerifications;
    uint256 public contractVersion;
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validRiskScore(uint8 _riskScore) {
        require(_riskScore <= 100, "Risk score must be between 0 and 100");
        _;
    }
    
    modifier notAlreadyVerified(address _walletAddress) {
        require(!verifications[_walletAddress].exists, "Wallet already verified");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        contractVersion = 1;
    }
    
    /**
     * @dev Verificar una wallet con datos de riesgo
     * @param _walletAddress Dirección de la wallet a verificar
     * @param _riskScore Puntuación de riesgo (0-100)
     * @param _riskLevel Nivel de riesgo (Low, Medium, High)
     * @param _isSanctioned Si la wallet está sancionada
     */
    function verifyWallet(
        address _walletAddress,
        uint8 _riskScore,
        RiskLevel _riskLevel,
        bool _isSanctioned
    ) 
        external 
        onlyOwner 
        validRiskScore(_riskScore)
        notAlreadyVerified(_walletAddress)
    {
        VerificationData memory newVerification = VerificationData({
            riskScore: _riskScore,
            riskLevel: _riskLevel,
            isSanctioned: _isSanctioned,
            verifiedAt: block.timestamp,
            verifiedBy: msg.sender,
            exists: true
        });
        
        verifications[_walletAddress] = newVerification;
        totalVerifications++;
        
        emit WalletVerified(
            _walletAddress,
            _riskScore,
            _riskLevel,
            _isSanctioned,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Verificar múltiples wallets en lote
     * @param _walletAddresses Array de direcciones de wallets
     * @param _riskScores Array de puntuaciones de riesgo
     * @param _riskLevels Array de niveles de riesgo
     * @param _isSanctionedArray Array de estados de sanción
     */
    function batchVerifyWallets(
        address[] calldata _walletAddresses,
        uint8[] calldata _riskScores,
        RiskLevel[] calldata _riskLevels,
        bool[] calldata _isSanctionedArray
    ) external onlyOwner {
        require(
            _walletAddresses.length == _riskScores.length &&
            _riskScores.length == _riskLevels.length &&
            _riskLevels.length == _isSanctionedArray.length,
            "Arrays length mismatch"
        );
        
        uint256 verifiedCount = 0;
        
        for (uint256 i = 0; i < _walletAddresses.length; i++) {
            address walletAddress = _walletAddresses[i];
            uint8 riskScore = _riskScores[i];
            RiskLevel riskLevel = _riskLevels[i];
            bool isSanctioned = _isSanctionedArray[i];
            
            // Solo verificar si no existe y el score es válido
            if (!verifications[walletAddress].exists && riskScore <= 100) {
                VerificationData memory newVerification = VerificationData({
                    riskScore: riskScore,
                    riskLevel: riskLevel,
                    isSanctioned: isSanctioned,
                    verifiedAt: block.timestamp,
                    verifiedBy: msg.sender,
                    exists: true
                });
                
                verifications[walletAddress] = newVerification;
                verifiedCount++;
                
                emit WalletVerified(
                    walletAddress,
                    riskScore,
                    riskLevel,
                    isSanctioned,
                    msg.sender,
                    block.timestamp
                );
            }
        }
        
        totalVerifications += verifiedCount;
        
        emit BatchVerificationCompleted(
            verifiedCount,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Obtener datos de verificación de una wallet
     * @param _walletAddress Dirección de la wallet
     * @return VerificationData Datos de verificación
     */
    function getVerification(address _walletAddress) 
        external 
        view 
        returns (VerificationData memory) 
    {
        return verifications[_walletAddress];
    }
    
    /**
     * @dev Verificar si una wallet está verificada
     * @param _walletAddress Dirección de la wallet
     * @return bool True si está verificada
     */
    function isVerified(address _walletAddress) external view returns (bool) {
        return verifications[_walletAddress].exists;
    }
    
    /**
     * @dev Obtener el total de verificaciones
     * @return uint256 Número total de verificaciones
     */
    function getTotalVerifications() external view returns (uint256) {
        return totalVerifications;
    }
    
    /**
     * @dev Obtener información del contrato
     * @return address Owner del contrato
     * @return uint256 Versión del contrato
     * @return uint256 Total de verificaciones
     */
    function getContractInfo() 
        external 
        view 
        returns (address, uint256, uint256) 
    {
        return (owner, contractVersion, totalVerifications);
    }
    
    /**
     * @dev Actualizar el owner del contrato (solo para emergencias)
     * @param _newOwner Nueva dirección del owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
    
    /**
     * @dev Función de emergencia para pausar el contrato
     * @notice Esta función puede ser implementada en versiones futuras
     */
    function emergencyPause() external onlyOwner {
        // Implementación futura para pausar el contrato
        revert("Emergency pause not implemented in this version");
    }
}
