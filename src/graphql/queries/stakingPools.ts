import gql from 'graphql-tag';

export const STAKINGPOOLS = gql`
    subscription stakingPools(
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
            commission
            totalUsers
            timestamp

            user {
                id
                stakedBalance
                totalBlocks
                totalReward
            }
        }
    }
`;

export const stakingPoolsQueryVars = {
    first: 10,
    where: {},
    orderBy: 'totalUsers',
    orderDirection: 'desc',
};
