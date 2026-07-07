// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import _ from 'lodash';
import { FixedNumber, WeiPerEther } from 'ethers';
import { Block } from '../graphql/models';

const BLOCK_INTERVAL = 13;

export const getRewardRate = (
    blocks: Block[],
    rawCirculatingSupply: number,
) => {
    let participationRate = FixedNumber.fromValue(0);
    let yearReturn = FixedNumber.fromValue(0);

    if (blocks && blocks.length > 0 && rawCirculatingSupply) {
        const blocksPerChain = _.groupBy(
            blocks,
            (block) => `${block.chain.protocol.version}-${block.chain.number}`,
        );

        const yearSeconds = 60n * 60n * 24n * 365n;

        const ratesPerChain = Object.keys(blocksPerChain).map((chainId) => {
            const blocks: Array<Block> = blocksPerChain[chainId];
            const protocol = blocks[0].chain.protocol.version;
            const targetInterval = blocks[0].chain.targetInterval || 1;

            // take average difficulty of all blocks in array
            const difficulty =
                blocks
                    .map((t) => BigInt(t.difficulty))
                    .reduce((sum, d) => sum + d, 0n) / BigInt(blocks.length);

            // protocol 1 interval is in seconds, 2 is in blocks
            const targetIntervalSeconds =
                protocol == 1
                    ? targetInterval
                    : targetInterval * BLOCK_INTERVAL;

            // formula depends on protocol version
            const activeStake =
                protocol == 1
                    ? difficulty / BigInt(targetInterval)
                    : (difficulty / BigInt(targetInterval)) * 10n ** 6n;

            // convert circulation supply to bigint and multiply by 1e18
            const circulationSupply =
                BigInt(rawCirculatingSupply) * WeiPerEther;

            // participation rate is a percentage of circulation supply
            // must use FixedNumber because bigint is only for integer
            const participationRate = FixedNumber.fromValue(
                activeStake,
            ).divUnsafe(FixedNumber.fromValue(circulationSupply));

            // calculate average prize
            const reward =
                blocks
                    .map((block) => BigInt(block.reward))
                    .reduce((sum, prize) => sum + prize, 0n) /
                BigInt(blocks.length);

            // total prize paid in one year
            const yearPrize =
                (yearSeconds / BigInt(targetIntervalSeconds)) * reward;

            // calculate year return
            const yearReturn = FixedNumber.fromValue(yearPrize).divUnsafe(
                FixedNumber.fromValue(activeStake),
            );

            return {
                participationRate,
                yearReturn,
            };
        });

        // Average participation rate
        participationRate = ratesPerChain
            .reduce(
                (prev, cur) => prev.addUnsafe(cur.participationRate),
                FixedNumber.fromValue(0),
            )
            .divUnsafe(FixedNumber.fromValue(ratesPerChain.length));

        // Sum up yearReturn
        yearReturn = ratesPerChain.reduce(
            (prev, cur) => prev.addUnsafe(cur.yearReturn),
            FixedNumber.fromValue(0),
        );
    }

    return {
        participationRate,
        yearReturn,
    };
};

export const getEstimatedRewardRate = (
    blocks: Block[],
    stake: bigint,
    totalStaked: number,
    period: number,
) => {
    let reward = 0n;
    let apr = FixedNumber.fromValue(0);
    let activeStake = 0n;

    if (blocks && blocks.length > 0) {
        const blocksPerChain = _.groupBy(
            blocks,
            (block) => `${block.chain.protocol.version}-${block.chain.number}`,
        );

        const ratesPerChain = Object.keys(blocksPerChain).map((chainId) => {
            const blocks: Array<Block> = blocksPerChain[chainId];
            const protocol = blocks[0].chain.protocol.version;
            const targetInterval = blocks[0].chain.targetInterval;

            const avgPrize =
                blocks.reduce((prev, cur) => prev + BigInt(cur.reward), 0n) /
                BigInt(blocks.length);

            // take average difficulty of all blocks in array
            const difficulty =
                blocks
                    .map((t) => BigInt(t.difficulty))
                    .reduce((sum, d) => sum + d, 0n) / BigInt(blocks.length);

            // protocol 1 interval is in seconds, 2 is in blocks
            const targetIntervalSeconds =
                protocol == 1
                    ? targetInterval
                    : targetInterval * BLOCK_INTERVAL;

            // formula depends on protocol version
            const activeStake =
                protocol == 1
                    ? difficulty / BigInt(targetInterval)
                    : (difficulty / BigInt(targetInterval)) * 10n ** 6n;

            // user stake share
            const stakePercentage = FixedNumber.fromValue(stake).divUnsafe(
                FixedNumber.fromValue(
                    BigInt(totalStaked) * WeiPerEther + stake,
                ),
            );

            // investment period in seconds
            const periodSeconds = BigInt(period) * 24n * 60n * 60n;

            // number of block drawn in that period
            const totalBlocks = periodSeconds / BigInt(targetIntervalSeconds);

            // number of block claimed by the user (statistically)
            const blocksClaimed = stakePercentage.mulUnsafe(
                FixedNumber.fromValue(totalBlocks),
            );

            // total reward
            const reward =
                avgPrize * BigInt(blocksClaimed.floor().toUnsafeFloat());

            // APR
            const yearSeconds = 365n * 24n * 60n * 60n;
            const yearBlocks = yearSeconds / BigInt(targetIntervalSeconds);

            const yearClaimed = stakePercentage.mulUnsafe(
                FixedNumber.fromValue(yearBlocks),
            );

            const yearReward =
                avgPrize * BigInt(yearClaimed.floor().toUnsafeFloat());
            const apr =
                stake === 0n
                    ? FixedNumber.fromValue(0)
                    : FixedNumber.fromValue(yearReward).divUnsafe(
                          FixedNumber.fromValue(stake),
                      );

            return {
                reward,
                apr,
                activeStake,
            };
        });

        // Sum up rewards
        reward = ratesPerChain.reduce((prev, cur) => prev + cur.reward, 0n);

        // Sum up aprs
        apr = ratesPerChain.reduce(
            (prev, cur) => prev.addUnsafe(cur.apr),
            FixedNumber.fromValue(0),
        );

        // Average active stake
        activeStake =
            ratesPerChain.reduce((prev, cur) => prev + cur.activeStake, 0n) /
            BigInt(ratesPerChain.length);
    }

    return {
        reward,
        apr,
        activeStake,
    };
};
