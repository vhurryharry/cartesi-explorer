// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { isAddress } from 'ethers';
import { useEthersProvider } from './provider';

export const useBalance = (address: string, deps: any[] = []): bigint => {
    const provider = useEthersProvider();
    const [balance, setBalance] = useState<bigint>(undefined);
    useEffect(() => {
        if (provider) {
            if (isAddress(address)) {
                provider.getBalance(address).then(setBalance);
            } else {
                setBalance(undefined);
            }
        }
    }, [provider, address, ...deps]);
    return balance;
};

export const useBlockNumber = (): number => {
    const { chainId } = useWeb3React();
    const provider = useEthersProvider();
    const [blockNumber, setBlockNumber] = useState<number>(0);
    useEffect(() => {
        if (provider) {
            provider.getBlockNumber().then(setBlockNumber);
            const updateBlockNumber = (blockNumber: number) => {
                setBlockNumber(blockNumber);
            };
            void provider.on('block', updateBlockNumber);
            return () => {
                void provider.off('block', updateBlockNumber);
                setBlockNumber(undefined);
            };
        }
    }, [provider, chainId]);
    return blockNumber;
};
