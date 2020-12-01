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
import { Web3Provider } from '@ethersproject/providers';

import { confirmations } from '../utils/networks';
import { ContractTransaction } from 'ethers';

enum ShowStoppers {
    SHOW,
    FADING_OUT,
    HIDE,
}

interface ConfirmationIndicatorProps {
    transaction?: Promise<ContractTransaction>;
    confirmationDone?: (error: string) => void;
    error?: string;
}

const ConfirmationIndicator = (props: ConfirmationIndicatorProps) => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const [
        currentTransaction,
        setCurrentTransaction,
    ] = useState<ContractTransaction>(null);

    const [confirmation, setConfirmation] = useState<number>(1);
    const [showMe, setShowMe] = useState<ShowStoppers>(ShowStoppers.HIDE);

    const [error, setError] = useState<string>();

    const hideMe = () => {
        setShowMe(ShowStoppers.FADING_OUT);

        setTimeout(() => {
            setShowMe(ShowStoppers.HIDE);

            props.confirmationDone(null);
        }, 2000);
    };

    useEffect(() => {
        if (props.transaction) {
            setShowMe(ShowStoppers.SHOW);

            props.transaction
                .then((tx) => {
                    setCurrentTransaction(tx);
                })
                .catch((err) => {
                    setError(err.message);
                });
        }
    }, [props.transaction]);

    useEffect(() => {
        setError(props.error);
    }, [props.error]);

    useEffect(() => {
        if (error) hideMe();
    }, [error]);

    // number of expected confirmations depend on chainId
    useEffect(() => {
        if (library && chainId) {
            setConfirmation(
                confirmations[chainId] ? confirmations[chainId] : 1
            );
        }
    }, [library, chainId]);

    useEffect(() => {
        try {
            if (library && currentTransaction) {
                // wait for confirmation
                currentTransaction.wait(confirmation).then((receipt) => {
                    hideMe();
                });
            }
        } catch (e) {
            // TODO: show error in component
            setError(e.message);
        }
    }, [currentTransaction]);

    return (
        <>
            <span
                className="confirmation-indicator"
                style={
                    showMe === ShowStoppers.SHOW
                        ? { opacity: 1 }
                        : showMe === ShowStoppers.FADING_OUT
                        ? {
                              opacity: 0,
                              transition: `opacity 2s ease-in`,
                          }
                        : { display: 'none' }
                }
            >
                <span className="confirmation-indicator-text">
                    {showMe === ShowStoppers.SHOW
                        ? 'Pending'
                        : showMe === ShowStoppers.FADING_OUT && error
                        ? 'Failure'
                        : 'Success'}
                </span>

                {showMe === ShowStoppers.SHOW ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                ) : showMe === ShowStoppers.FADING_OUT && error ? (
                    <i className="fas fa-times"></i>
                ) : (
                    <i className="fas fa-check"></i>
                )}
            </span>
        </>
    );
};

export default ConfirmationIndicator;
