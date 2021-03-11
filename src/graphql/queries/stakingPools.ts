import gql from 'graphql-tag';

export const STAKINGPOOLS = gql`
    query stakingPools(
        $first: Int
        $skip: Int
        $where: StakingPool_filter
        $orderBy: StakingPool_orderBy
        $orderDirection: OrderDirection
    ) {
        stakingPools(
            first: $first
            skip: $skip
            where: $where
            orderBy: $orderBy
            orderDirection: $orderDirection
        ) {
            id
            stakedBalance
            totalBlocks
            totalReward
        }
    }
`;

export const stakingPoolsQueryVars = {
    first: 10,
    where: {},
    orderBy: 'stakedBalance',
    orderDirection: 'desc',
};
