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
import { Web3Provider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, constants, FixedNumber } from 'ethers';
import { useBlockNumber } from './eth';
import {
    useStakingPoolContract,
    useFeeContract,
    useFlatRateCommissionContract,
    useGasTaxCommissionContract,
} from './contracts';
import { useTransaction } from './transaction';

export interface StakingPoolCommission {
    value: number;
    loading: boolean;
}

export const useStakingPool = (address: string) => {
    const { account } = useWeb3React<Web3Provider>();
    const stakingPool = useStakingPoolContract(address);

    const blockNumber = useBlockNumber();
    const { waiting, error, setError, setTransaction } = useTransaction();

    const [stakedBalance, setStakedBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [maturingTimestamp, setMaturingTimestamp] = useState<Date>(null);
    const [releasingTimestamp, setReleasingTimestamp] = useState<Date>(null);
    const [maturingBalance, setMaturingBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [releasingBalance, setReleasingBalance] = useState<BigNumber>(
        constants.Zero
    );
    const [paused, setPaused] = useState<Boolean>(false);

    useEffect(() => {
        if (stakingPool && account) {
            stakingPool.getStakedBalance(account).then(setStakedBalance);
            stakingPool
                .getMaturingTimestamp(account)
                .then((value) =>
                    setMaturingTimestamp(new Date(value.toNumber() * 1000))
                );
            stakingPool
                .getReleasingTimestamp(account)
                .then((value) =>
                    setReleasingTimestamp(new Date(value.toNumber() * 1000))
                );
            stakingPool.getMaturingBalance(account).then(setMaturingBalance);
            stakingPool.getReleasingBalance(account).then(setReleasingBalance);
            stakingPool.paused().then(setPaused);
        }
    }, [stakingPool, account, blockNumber]);

    const stake = (amount: BigNumberish) => {
        if (stakingPool) {
            try {
                // send transaction
                setTransaction(stakingPool.stake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const unstake = (amount: BigNumberish) => {
        if (stakingPool) {
            try {
                // send transaction
                setTransaction(stakingPool.unstake(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const withdraw = (amount: BigNumberish) => {
        if (stakingPool) {
            try {
                // send transaction
                setTransaction(stakingPool.withdraw(amount));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const setName = (name: string) => {
        if (stakingPool) {
            try {
                setTransaction(stakingPool.setName(name));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const pause = () => {
        if (stakingPool) {
            try {
                setTransaction(stakingPool.pause());
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const unpause = () => {
        if (stakingPool) {
            try {
                setTransaction(stakingPool.unpause());
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const hire = (worker: string, amount: BigNumber) => {
        if (stakingPool) {
            try {
                setTransaction(stakingPool.hire(worker, { value: amount }));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const cancelHire = (worker: string) => {
        if (stakingPool) {
            try {
                setTransaction(stakingPool.cancelHire(worker));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const retire = (worker: string) => {
        if (stakingPool) {
            try {
                setTransaction(stakingPool.retire(worker));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        staking: stakingPool,
        error,
        waiting,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        paused,
        stake,
        unstake,
        withdraw,
        setName,
        pause,
        unpause,
        hire,
        cancelHire,
        retire,
    };
};

export const useStakingPoolCommission = (
    address: string,
    reward: BigNumberish
) => {
    const fee = useFeeContract(address);
    const [commission, setCommission] = useState<StakingPoolCommission>({
        value: undefined,
        loading: false,
    });

    useEffect(() => {
        if (fee) {
            setCommission({
                value: undefined,
                loading: true,
            });
            fee.getCommission(0, reward).then((value) => {
                const percentage = FixedNumber.from(value)
                    .divUnsafe(FixedNumber.from(reward))
                    .toUnsafeFloat();
                setCommission({
                    value: percentage,
                    loading: false,
                });
            });
        }
    }, [fee]);

    return commission;
};

export const useFlatRateCommission = (address: string) => {
    const fee = useFlatRateCommissionContract(address);
    const { waiting, error, setError, setTransaction } = useTransaction();

    const setRate = (rate: number) => {
        if (fee) {
            try {
                setTransaction(fee.setRate(rate));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        setRate,
        waiting,
        error,
    };
};

export const useGasTaxCommission = (address: string) => {
    const fee = useGasTaxCommissionContract(address);
    const { waiting, error, setError, setTransaction } = useTransaction();

    const setGas = (gas: number) => {
        if (fee) {
            try {
                setTransaction(fee.setGas(gas));
            } catch (e) {
                setError(e.message);
            }
        }
    };

    return {
        setGas,
        waiting,
        error,
    };
};
