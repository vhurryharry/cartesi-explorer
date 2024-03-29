// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber, BigNumberish, constants, FixedNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

export const formatCTSI = (amount: BigNumberish, decimals = 18): string => {
    amount = BigNumber.from(amount);

    // floor value to number of decimals to display
    const m = constants.One.mul(10).pow(18 - decimals);
    amount = amount.sub(amount.mod(m));

    // convert to string
    const ctsiValue = parseFloat(formatUnits(amount, 18));
    if (isInfinite(ctsiValue)) return 'Infinite';
    return ctsiValue.toLocaleString();
};

export const toCTSI = (amount: BigNumberish): FixedNumber => {
    return FixedNumber.from(formatUnits(amount, 18));
};

export const isInfinite = (amount: BigNumberish): boolean => {
    return amount > 1e9;
};
