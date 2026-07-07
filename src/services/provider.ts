// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import { BrowserProvider, Eip1193Provider } from 'ethers';

/**
 * Bridges the wallet exposed by @web3-react (which is still typed against
 * ethers v5) to an ethers v6 BrowserProvider, so the rest of the app can use
 * ethers v6 providers, signers and contracts.
 */
export const useEthersProvider = (): BrowserProvider | undefined => {
    const { connector, chainId, account } = useWeb3React();
    return useMemo(() => {
        const eip1193 = connector?.provider as Eip1193Provider | undefined;
        return eip1193 ? new BrowserProvider(eip1193, 'any') : undefined;
    }, [connector, chainId, account]);
};
