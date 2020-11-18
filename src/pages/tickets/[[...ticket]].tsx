import React from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import useTickets from '../../graphql/hooks/useTickets';
import { tinyString } from '../../utils/stringUtils';
import useTicket from '../../graphql/hooks/useTicket';
import { useCartesiToken } from '../../services/token';
import { tinyGraphUrl } from '../../utils/tinygraph';
import Link from 'next/link';

const Ticket = () => {
    const router = useRouter();
    let { ticket: ticketId } = router.query;
    ticketId = ticketId && ticketId.length > 0 ? (ticketId[0] as string) : null;

    const { formatCTSI } = useCartesiToken(null, null, null);
    const { tickets, refreshTickets } = useTickets();
    const { ticket } = useTicket(ticketId);

    return (
        <Layout className="tickets">
            <Head>
                <title>Cartesi - Lottery</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="tickets-header d-flex justify-content-between align-items-center py-3">
                <div className="overline text-white">Lottery</div>
                <div className="input-with-icon input-group">
                    <span>
                        <i className="fas fa-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                    />
                </div>
            </div>

            <div className="tickets-content">
                <div className="tickets-content-ticket-list">
                    {tickets.map((ticket) => {
                        return (
                            <div
                                className="tickets-content-ticket row"
                                key={ticket.id}
                            >
                                <div className="col-9 row">
                                    <div className="sub-title-4 col-4">
                                        Date
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {new Date(
                                            ticket.timestamp * 1000
                                        ).toUTCString()}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Claimer Address
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {ticket.user.id}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Node Address
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {ticket.worker.id}
                                    </div>

                                    <div className="sub-title-4 col-4">
                                        Reward
                                    </div>
                                    <div className="body-text-2 col-8">
                                        {formatCTSI(ticket.userPrize)}
                                    </div>
                                </div>
                                <div className="col-3 d-flex flex-column align-items-center">
                                    <img
                                        className="landing-lottery-ticket-content-content-image"
                                        src={tinyGraphUrl(ticket)}
                                    />
                                    <div className="body-text-2 pt-1">
                                        {tinyString(ticket.id)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
};

export default Ticket;
