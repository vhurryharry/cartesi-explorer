// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { formatEther } from '@ethersproject/units';
import { Alert, Button, Descriptions, Spin } from 'antd';
import { useBalance, useAccount, NULL_ADDRESS } from '../../services/eth';
import { useProxyManager } from '../../services/proxyManager';

export default () => {
    const router = useRouter();
    let { address } = router.query;
    address = address as string;
    const account = useAccount(0);
    const balance = useBalance(address);

    const {
        proxyManager,
        owner,
        error,
        loading,
        submitting,
        claimProxy,
        releaseProxy,
    } = useProxyManager(address);

    return (
        <div className="container">
            <Head>
                <title>Proxies</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {error && <Alert key="error" message={error} type="error" />}
                <Descriptions
                    title="Proxy information"
                    bordered
                    column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="Address">
                        {address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Balance">
                        {formatEther(balance)} ETH
                    </Descriptions.Item>
                    <Descriptions.Item label="Owner">
                        {loading && <Spin />}
                        {owner === NULL_ADDRESS ? (
                            <i>&lt;none&gt;</i>
                        ) : (
                            owner
                        )}{' '}
                        {owner === account && owner !== NULL_ADDRESS && (
                            <i>(you)</i>
                        )}
                    </Descriptions.Item>
                </Descriptions>
                {proxyManager && account && owner === NULL_ADDRESS && (
                    <Button
                        onClick={claimProxy}
                        type="primary"
                        loading={submitting}
                    >
                        Claim proxy
                    </Button>
                )}
                {proxyManager && account && owner === account && (
                    <Button
                        onClick={releaseProxy}
                        type="primary"
                        loading={submitting}
                    >
                        Release proxy
                    </Button>
                )}
            </main>
        </div>
    );
};