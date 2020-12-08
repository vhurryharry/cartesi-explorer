// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useEffect, useState } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const uris = {
    1: 'https://api.thegraph.com/subgraphs/name/cartesi/pos',
    5: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli',
    31337: 'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli',
};

export const initializeApollo = (chainId: number): ApolloClient<any> => {
    const uri =
        uris[chainId] ||
        'https://api.thegraph.com/subgraphs/name/cartesi/pos-goerli';
    const ssrMode = typeof window === 'undefined';
    console.log('initializeApollo', chainId, uri, ssrMode);
    return new ApolloClient({
        ssrMode,
        link: new HttpLink({
            uri,
        }),
        cache: new InMemoryCache(),
    });
};

export const useApollo = (chainId: number): ApolloClient<any> => {
    const [client, setClient] = useState<ApolloClient<any>>(initializeApollo(5));

    useEffect(() => {
        setClient(initializeApollo(chainId));
    }, [chainId]);

    return client;
};
