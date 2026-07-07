// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumberish, FixedNumber, formatUnits, getBigInt } from 'ethers';

export const formatCTSI = (amount: BigNumberish, decimals = 18): string => {
    let value = getBigInt(amount);

    // floor value to number of decimals to display
    const m = 10n ** BigInt(18 - decimals);
    value = value - (value % m);

    // convert to string
    const ctsiValue = parseFloat(formatUnits(value, 18));
    if (isInfinite(ctsiValue)) return 'Infinite';
    return ctsiValue.toLocaleString();
};

export const toCTSI = (amount: BigNumberish): FixedNumber => {
    return FixedNumber.fromString(formatUnits(amount, 18));
};

export const isInfinite = (amount: number): boolean => {
    return amount > 1e9;
};
