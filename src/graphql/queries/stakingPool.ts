import gql from 'graphql-tag';

export const STAKINGPOOL = gql`
    subscription stakingPool($id: String) {
        stakingPool(id: $id) {
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

export const stakingPoolQueryVars = {
    id: '0',
};
