// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useEffect } from 'react';
import { formatEther, parseEther } from '@ethersproject/units';
import { Button, Descriptions, Spin, Row, Col } from 'antd';

import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { AddressZero } from '@ethersproject/constants';

import { useBalance } from '../services/eth';
import { useWorkerManager } from '../services/workerManager';

import { networks } from '../utils/networks';
import { ContractTransaction } from 'ethers';

interface NodeDetailsProps {
    address: string;
    waiting: boolean;
    setWorkerTransaction: (
        currentTransaction: Promise<ContractTransaction>
    ) => void;
    setWorkerError: (error: string) => void;
}

const NodeDetails = (props: NodeDetailsProps) => {
    const { chainId, account } = useWeb3React<Web3Provider>();

    const network = networks[chainId];
    const posArtifact = require(`@cartesi/pos/deployments/${network}/PoS.json`);
    const posAddress: string = posArtifact?.address as string;

    const {
        user,
        available,
        pending,
        owned,
        retired,
        loading,
        authorized,
        error: workerManagerError,
        transaction: workerManagerTransaction,
        hire,
        cancelHire,
        retire,
    } = useWorkerManager(props.address);

    // make balance depend on owner, so if it changes we update the balance
    const balance = useBalance(props.address, [user]);

    useEffect(() => {
        if (workerManagerTransaction) {
            props.setWorkerTransaction(workerManagerTransaction);
        }
        if (workerManagerError) {
            props.setWorkerError(workerManagerError);
        }
    }, [workerManagerTransaction, workerManagerError]);

    return (
        <Row align="middle" gutter={16}>
            <Col>
                <Descriptions
                    bordered
                    size="small"
                    column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item label="Address">
                        {props.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Balance">
                        {formatEther(balance)} ETH
                    </Descriptions.Item>
                    <Descriptions.Item label="Owner">
                        {loading && <Spin />}
                        {user === AddressZero ? <i>&lt;none&gt;</i> : user}{' '}
                        {pending && <i>(pending)</i>}
                        {retired && <i>(retired)</i>}
                    </Descriptions.Item>
                </Descriptions>
            </Col>

            <Col>
                {account && available && (
                    <Button
                        onClick={() => hire(parseEther('1'))}
                        type="primary"
                        disabled={props.waiting}
                    >
                        Hire node
                    </Button>
                )}
                {account && pending && (
                    <Button
                        onClick={cancelHire}
                        type="primary"
                        disabled={props.waiting}
                    >
                        Cancel hire
                    </Button>
                )}
                {account && owned && (
                    <>
                        <Button
                            onClick={retire}
                            type="primary"
                            disabled={props.waiting}
                        >
                            Retire node
                        </Button>
                    </>
                )}
            </Col>
        </Row>
    );
};

export default NodeDetails;
