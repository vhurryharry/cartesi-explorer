// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useQuery } from '@apollo/client';
import { StakingPoolData, StakingPoolVars } from '../models';
import { STAKINGPOOL } from '../queries/stakingPool';

const useStakingPool = (id: string) => {
    const { data } = useQuery<StakingPoolData, StakingPoolVars>(STAKINGPOOL, {
        variables: {
            id: id?.toLowerCase(),
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 60000,
    });

    return data?.stakingPool;
};

export default useStakingPool;
