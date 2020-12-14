// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

import ApolloContainer from '../components/ApolloContainer';

import '../styles/styles.scss';
import '@fortawesome/fontawesome-free/css/all.css';

if (typeof window !== 'undefined') {
    require('jquery');
    require('popper.js');
    require('bootstrap');
}

const Web3Container = dynamic(() => import('../components/Web3Container'), {
    ssr: false,
});

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Web3Container>
            <ApolloContainer>
                <Component {...pageProps} />
            </ApolloContainer>
        </Web3Container>
    );
};

export default App;
