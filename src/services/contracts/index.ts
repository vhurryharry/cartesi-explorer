// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ContractRunner } from 'ethers';

import {
    WorkerManagerAuthManagerImpl__factory,
    WorkerManagerAuthManagerImpl,
    CartesiToken,
    CartesiToken__factory,
    SimpleFaucet,
    SimpleFaucet__factory,
} from '../../contracts/types';

import { useEthersProvider } from '../provider';

import util_mainnet from '@cartesi/util/export/abi/mainnet.json';
import util_goerli from '@cartesi/util/export/abi/goerli.json';

import token_mainnet from '@cartesi/token/export/abi/mainnet.json';
import token_goerli from '@cartesi/token/export/abi/goerli.json';

import localhost from './localhost.json';

import * as pos from './pos';
import * as pos1 from './pos-1.0';
import * as pool from './pool';

export interface ContractAbi {
    address: string;
    abi: any[];
}

export interface ContractMap {
    [name: string]: ContractAbi;
}

export interface ChainAbi {
    name: string;
    chainId: string;
    contracts: ContractMap;
}

export interface ChainMap {
    [chainId: number]: ChainAbi;
}

const utilAbis: ChainMap = {
    1: util_mainnet,
    5: util_goerli,
    31337: localhost,
};

const tokenAbis: ChainMap = {
    1: token_mainnet,
    5: token_goerli,
    31337: localhost,
};

export const getAddress = (
    chainId: number,
    map: ChainMap,
    name: string,
): string => {
    const chain = map[chainId];
    if (!chain) {
        console.log(`Unsupported chain '${chainId}' for contract ${name}`);
        return;
    }

    const contract = chain.contracts[name];
    if (!contract) {
        console.log(
            `No ${name} deployed at network ${chain.name} (${chainId})`,
        );
        return;
    }

    const address = contract.address;
    console.log(
        `${name} resolved to address ${address} at network ${chain.name} (${chainId})`,
    );
    return address;
};

export function useContract<C>(
    connector: (address: string, runner: ContractRunner) => C,
    abis: ChainMap,
    name: string,
): C {
    const { chainId } = useWeb3React();
    const provider = useEthersProvider();

    // contract is a state variable, because it's async
    const [contract, setContract] = useState<C>();

    // use an effect because it's async
    useEffect(() => {
        if (!provider || !chainId) {
            // provider or chainId not set, reset to undefined
            setContract(undefined);
            return;
        }

        // try to resolve address
        const address = getAddress(chainId, abis, name);

        if (!address) {
            setContract(undefined);
            return;
        }

        let stale = false;
        // use provider signer
        provider.getSigner().then((signer) => {
            if (!stale) {
                // call the factory connector
                setContract(connector(address, signer));
            }
        });

        return () => {
            stale = true;
        };
    }, [provider, chainId]);

    return contract;
}

export function useContractFromAddress<C>(
    connector: (address: string, runner: ContractRunner) => C,
    address: string,
): C {
    const { chainId } = useWeb3React();
    const provider = useEthersProvider();

    // contract is a state variable, because it's async
    const [contract, setContract] = useState<C>();

    // use an effect because it's async
    useEffect(() => {
        if (!provider || !chainId || !address) {
            // provider or chainId not set, reset to undefined
            setContract(undefined);
            return;
        }

        let stale = false;
        // use provider signer
        provider.getSigner().then((signer) => {
            if (!stale) {
                // call the factory connector
                setContract(connector(address, signer));
            }
        });

        return () => {
            stale = true;
        };
    }, [provider, chainId, address]);

    return contract;
}

export const useWorkerManagerContract = (): WorkerManagerAuthManagerImpl => {
    return useContract(
        WorkerManagerAuthManagerImpl__factory.connect,
        utilAbis,
        'WorkerManagerAuthManagerImpl',
    );
};

export const useCartesiTokenContract = (): CartesiToken => {
    return useContract(
        CartesiToken__factory.connect,
        tokenAbis,
        'CartesiToken',
    );
};

export const useSimpleFaucetContract = (): SimpleFaucet => {
    return useContract(
        SimpleFaucet__factory.connect,
        tokenAbis,
        'SimpleFaucet',
    );
};

export const useStakingContract = pos.useStakingContract;
export const usePoSContract = pos.usePoSContract;
export const usePoS1Contract = pos1.usePoSContract;

export const useStakingPoolContract = pool.useStakingPoolContract;
export const useFeeContract = pool.useFeeContract;
export const useFlatRateCommissionContract = pool.useFlatRateCommissionContract;
export const useGasTaxCommissionContract = pool.useGasTaxCommissionContract;
export const useStakingPoolFactoryContract = pool.useStakingPoolFactoryContract;
