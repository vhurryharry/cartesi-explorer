// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

export const networks = {
    1: 'mainnet',
    3: 'ropsten',
    5: 'goerli',
    31337: 'localhost',
};

export const confirmations = {
    1: 3,
    3: 1,
    5: 1,
    31337: 1,
};

export const etherscanLinks = {
    1: 'https://etherscan.io',
    3: 'https://ropsten.etherscan.io',
    5: 'https://goerli.etherscan.io',
    31337: null,
};
