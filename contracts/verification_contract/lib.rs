#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod verification_contract {
    use ink_storage::traits::SpreadAllocate;
    use ink_storage::Mapping;

    /// Event emitted when a wallet is verified
    #[ink(event)]
    pub struct WalletVerified {
        #[ink(topic)]
        wallet_address: [u8; 20],
        risk_score: u8,
        risk_level: RiskLevel,
        verified_by: AccountId,
    }

    /// Risk levels for wallet verification
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum RiskLevel {
        Low,
        Medium,
        High,
    }

    /// Verification data structure
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode, Clone)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct VerificationData {
        risk_score: u8,
        risk_level: RiskLevel,
        verified_at: u64,
        verified_by: AccountId,
        is_sanctioned: bool,
    }

    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct VerificationContract {
        /// Mapping from wallet address to verification data
        verifications: Mapping<[u8; 20], VerificationData>,
        /// Owner of the contract
        owner: AccountId,
        /// Total verifications count
        total_verifications: u32,
    }

    impl VerificationContract {
        /// Constructor that initializes the contract
        #[ink(constructor)]
        pub fn new() -> Self {
            ink_lang::utils::initialize_contract(|instance: &mut Self| {
                instance.owner = Self::env().caller();
                instance.total_verifications = 0;
            })
        }

        /// Verify a wallet with risk assessment
        #[ink(message)]
        pub fn verify_wallet(
            &mut self,
            wallet_address: [u8; 20],
            risk_score: u8,
            risk_level: RiskLevel,
            is_sanctioned: bool,
        ) -> Result<(), VerificationError> {
            // Only owner can verify wallets
            if self.env().caller() != self.owner {
                return Err(VerificationError::NotAuthorized);
            }

            // Validate risk score (0-100)
            if risk_score > 100 {
                return Err(VerificationError::InvalidRiskScore);
            }

            let verification_data = VerificationData {
                risk_score,
                risk_level: risk_level.clone(),
                verified_at: self.env().block_timestamp(),
                verified_by: self.env().caller(),
                is_sanctioned,
            };

            // Store verification
            self.verifications.insert(wallet_address, &verification_data);
            self.total_verifications += 1;

            // Emit event
            self.env().emit_event(WalletVerified {
                wallet_address,
                risk_score,
                risk_level,
                verified_by: self.env().caller(),
            });

            Ok(())
        }

        /// Get verification data for a wallet
        #[ink(message)]
        pub fn get_verification(&self, wallet_address: [u8; 20]) -> Option<VerificationData> {
            self.verifications.get(wallet_address)
        }

        /// Check if a wallet is verified
        #[ink(message)]
        pub fn is_verified(&self, wallet_address: [u8; 20]) -> bool {
            self.verifications.contains(wallet_address)
        }

        /// Get total number of verifications
        #[ink(message)]
        pub fn get_total_verifications(&self) -> u32 {
            self.total_verifications
        }

        /// Get contract owner
        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }

        /// Batch verify multiple wallets
        #[ink(message)]
        pub fn batch_verify_wallets(
            &mut self,
            wallets: Vec<([u8; 20], u8, RiskLevel, bool)>,
        ) -> Result<u32, VerificationError> {
            if self.env().caller() != self.owner {
                return Err(VerificationError::NotAuthorized);
            }

            let mut verified_count = 0;
            for (wallet_address, risk_score, risk_level, is_sanctioned) in wallets {
                if risk_score > 100 {
                    continue; // Skip invalid entries
                }

                let verification_data = VerificationData {
                    risk_score,
                    risk_level: risk_level.clone(),
                    verified_at: self.env().block_timestamp(),
                    verified_by: self.env().caller(),
                    is_sanctioned,
                };

                self.verifications.insert(wallet_address, &verification_data);
                verified_count += 1;

                // Emit event for each verification
                self.env().emit_event(WalletVerified {
                    wallet_address,
                    risk_score,
                    risk_level,
                    verified_by: self.env().caller(),
                });
            }

            self.total_verifications += verified_count;
            Ok(verified_count)
        }
    }

    /// Errors that can occur during verification
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum VerificationError {
        NotAuthorized,
        InvalidRiskScore,
        WalletAlreadyVerified,
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = VerificationContract::new();
            assert_eq!(contract.get_total_verifications(), 0);
        }

        #[ink::test]
        fn verify_wallet_works() {
            let mut contract = VerificationContract::new();
            let wallet_address = [1u8; 20];
            let risk_score = 25;
            let risk_level = RiskLevel::Low;
            let is_sanctioned = false;

            assert_eq!(
                contract.verify_wallet(wallet_address, risk_score, risk_level, is_sanctioned),
                Ok(())
            );

            assert_eq!(contract.is_verified(wallet_address), true);
            assert_eq!(contract.get_total_verifications(), 1);

            let verification = contract.get_verification(wallet_address).unwrap();
            assert_eq!(verification.risk_score, risk_score);
            assert_eq!(verification.risk_level, RiskLevel::Low);
            assert_eq!(verification.is_sanctioned, false);
        }

        #[ink::test]
        fn batch_verify_works() {
            let mut contract = VerificationContract::new();
            let wallets = vec![
                ([1u8; 20], 25, RiskLevel::Low, false),
                ([2u8; 20], 55, RiskLevel::Medium, false),
                ([3u8; 20], 85, RiskLevel::High, true),
            ];

            let result = contract.batch_verify_wallets(wallets);
            assert_eq!(result, Ok(3));
            assert_eq!(contract.get_total_verifications(), 3);
        }
    }
}
