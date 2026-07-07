// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import MetaMaskOnboarding from '@metamask/onboarding';
import { metaMask } from '../services/connectors';
import { IChainData, getChain } from '../services/chain';
import { networks } from '../utils/networks';

const supportedChainIds = Object.keys(networks).map((key) => parseInt(key));

const SelectedChain = () => {
    const { chainId, isActive } = useWeb3React();
    const isUnsupportedChainId =
        isActive &&
        chainId !== undefined &&
        !supportedChainIds.includes(chainId);
    const [chain, setChain] = useState<IChainData>(undefined);
    const hasMetaMask = MetaMaskOnboarding.isMetaMaskInstalled();

    // try to eagerly reconnect to a previously authorized wallet
    useEffect(() => {
        void metaMask.connectEagerly();
    }, []);

    // get chain name
    useEffect(() => {
        if (chainId && !isUnsupportedChainId) {
            getChain(chainId).then(setChain);
        } else {
            setChain(undefined);
        }
    }, [chainId, isUnsupportedChainId]);

    const connectNetwork = () => {
        void metaMask.activate();
    };

    return (
        <div className="selected-chain">
            {chain && (
                <div>
                    <span style={{ color: 'white' }}>{chain.name}</span>
                </div>
            )}
            {isUnsupportedChainId && (
                <button type="button" className="btn btn-danger button-text">
                    <img src="/images/metamask.png" />
                    Unsupported Network
                </button>
            )}
            {!isActive && !isUnsupportedChainId && (
                <button
                    type="button"
                    className="btn btn-primary button-text"
                    onClick={connectNetwork}
                >
                    <img src="/images/metamask.png" />
                    {hasMetaMask ? 'Connect To Wallet' : 'Install MetaMask'}
                </button>
            )}
        </div>
    );
};

export default SelectedChain;
