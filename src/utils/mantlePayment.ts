import { ethers } from 'ethers';

export interface PaymentResult {
  hash: string;
  success: boolean;
  error?: string;
}

export async function sendPayment(
  signer: ethers.JsonRpcSigner,
  recipientAddress: string,
  amountMNT: number
): Promise<PaymentResult> {
  try {
    if (amountMNT <= 0) {
      return {
        hash: '',
        success: false,
        error: 'Payment amount must be greater than 0'
      };
    }

    // Validate recipient address
    if (!ethers.isAddress(recipientAddress)) {
      return {
        hash: '',
        success: false,
        error: 'Invalid recipient wallet address'
      };
    }

    // Convert MNT to Wei
    const amountWei = ethers.parseEther(amountMNT.toString());

    // Create transaction
    const transaction = {
      to: recipientAddress,
      value: amountWei,
    };

    // Send transaction
    const txResponse = await signer.sendTransaction(transaction);

    // Wait for confirmation
    const receipt = await txResponse.wait();

    if (!receipt) {
      throw new Error('Transaction failed');
    }

    return {
      hash: txResponse.hash,
      success: true
    };
  } catch (error) {
    console.error('Payment error:', error);

    let errorMessage = 'Payment failed';
    if (error instanceof Error) {
      if (error.message.includes('user rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient MNT balance';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      hash: '',
      success: false,
      error: errorMessage
    };
  }
}

export function getMantleExplorerUrl(hash: string): string {
  return `https://explorer.sepolia.mantle.xyz/tx/${hash}`;
}
