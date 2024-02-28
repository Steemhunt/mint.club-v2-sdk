type BondSteps = readonly { rangeTo: bigint; price: bigint }[];

// Utility function to calculate royalty
export function calculateRoyalty(amount: bigint, rate: number): bigint {
  return (amount * BigInt(rate)) / 10000n;
}

// Utility function to find the current step index based on the current supply
function getCurrentStepIndex(currentSupply: bigint, bondSteps: BondSteps): number {
  return bondSteps.findIndex((step) => currentSupply < step.rangeTo) || bondSteps.length - 1;
}

// Common function to calculate adjustments for minting and burning
function calculateAdjustments(
  tokens: bigint,
  bondSteps: BondSteps,
  currentSupply: bigint,
  multiFactor: bigint,
  royaltyRate: number,
  slippage: number,
  isMinting: boolean,
): { adjustedAmount: bigint; royalty: bigint } {
  let totalAmount = 0n;
  let tokensProcessed = tokens;
  let stepIndex = getCurrentStepIndex(currentSupply, bondSteps);
  let tempCurrentSupply = currentSupply;

  while (tokensProcessed > 0n && stepIndex < bondSteps.length && stepIndex >= 0) {
    const step = bondSteps[stepIndex];
    const supplyDelta = isMinting
      ? step.rangeTo - tempCurrentSupply
      : tempCurrentSupply - (stepIndex > 0 ? bondSteps[stepIndex - 1].rangeTo : 0n);
    const tokensToProcess = tokensProcessed > supplyDelta ? supplyDelta : tokensProcessed;

    const factor = isMinting ? multiFactor - 1n : 0n;

    totalAmount += (tokensToProcess * step.price + factor) / multiFactor;
    tokensProcessed -= tokensToProcess;
    tempCurrentSupply += isMinting ? tokensToProcess : -tokensToProcess;

    stepIndex += isMinting ? 1 : -1;
  }

  const royalty = calculateRoyalty(totalAmount, royaltyRate);
  let adjustedAmount = totalAmount + (isMinting ? royalty : -royalty);
  const slippageAmount = calculateRoyalty(adjustedAmount, slippage);
  adjustedAmount += isMinting ? slippageAmount : -slippageAmount;

  return { adjustedAmount, royalty };
}

// Generic binary search function for both minting and burning
function binarySearch(params: {
  reserveAmount: bigint;
  bondSteps: BondSteps;
  currentSupply: bigint;
  maxSupply: bigint;
  multiFactor: bigint;
  royaltyRate: number;
  slippage: number;
  isMinting: boolean;
}): bigint {
  const { reserveAmount, bondSteps, currentSupply, maxSupply, multiFactor, royaltyRate, slippage, isMinting } = params;
  let low = 0n;
  let high = isMinting ? maxSupply - currentSupply : currentSupply;
  let mid = 0n;
  let lastClosest = 0n;

  // safety check to avoid infinite loop
  const MAX_ITERATIONS = 1000;
  let iterations = 0;

  while (low <= high && iterations++ < MAX_ITERATIONS) {
    mid = (high + low) / 2n;
    const { adjustedAmount } = calculateAdjustments(
      mid,
      bondSteps,
      currentSupply,
      multiFactor,
      royaltyRate,
      slippage,
      isMinting,
    );

    if (adjustedAmount === reserveAmount) return mid;
    else if (adjustedAmount < reserveAmount) {
      low = mid + 1n;
      lastClosest = mid;
    } else high = mid - 1n;
  }

  return lastClosest;
}

// Using the generic binary search function for minting and burning
export function binaryReverseMint(params: {
  reserveAmount: bigint;
  bondSteps: BondSteps;
  currentSupply: bigint;
  maxSupply: bigint;
  multiFactor: bigint;
  mintRoyalty: number;
  slippage: number;
}): bigint {
  return binarySearch({
    ...params,
    royaltyRate: params.mintRoyalty,
    isMinting: true,
  });
}

export function binaryReverseBurn(params: {
  reserveAmount: bigint;
  bondSteps: BondSteps;
  currentSupply: bigint;
  multiFactor: bigint;
  burnRoyalty: number;
  slippage: number;
}): bigint {
  // MaxSupply is not relevant for burning, so it's set to currentSupply
  return binarySearch({
    ...params,
    maxSupply: params.currentSupply,
    royaltyRate: params.burnRoyalty,
    isMinting: false,
  });
}
