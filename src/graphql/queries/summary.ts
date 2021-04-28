import gql from 'graphql-tag';

export const SUMMARY = gql`
    subscription summary($id: ID) {
        summary(id: $id) {
            id
            totalUsers
            totalPools
            totalStakers
            totalNodes
            totalStaked
            totalBlocks
            totalReward
            totalChains
        }
    }
`;

export const summaryQueryVars = {
    id: 1,
};
