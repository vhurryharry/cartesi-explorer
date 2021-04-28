import gql from 'graphql-tag';

export const USER = gql`
    subscription user($id: String) {
        user(id: $id) {
            id
            stakedBalance
            totalBlocks
            totalReward
        }
    }
`;

export const userQueryVars = {
    id: '0',
};
