// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { useBalance } from '../utils/ethereum';
import { ethers } from 'ethers';

export interface InfoProps {
    address: string;
}

export const Info = (props: InfoProps) => {
    const balance = useBalance(props.address);

    return <div>
        <p>Address: {props.address}</p>
        <p>Balance: {balance && ethers.utils.formatEther(balance)} ETH</p>
    </div>;
};
