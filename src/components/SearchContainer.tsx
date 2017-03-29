import * as _ from 'underscore';
import * as PubNub from './../../node_modules/pubnub/dist/web/pubnub';
import * as React from 'react';
import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosPromise, AxiosResponse
} from 'axios';

import { SearchBox } from "./SearchBox";
import { SearchResults } from "./SearchResults";
import {
    BookingDetailsLink,
    Itinerary,
    PricingOption,
} from './../skyscanner';

export interface SearchContainerProps {}

export interface SearchContainerState {
    itineraries:  Array<Itinerary>;
    pnChannel: string;
    pubnub: any;
}

export class SearchContainer extends React.Component<SearchContainerProps, SearchContainerState> {
    constructor(props: SearchContainerProps) {
        super(props);

        const pubnub = new PubNub({
            subscribeKey: 'sub-c-d4324024-0f6a-11e7-8d31-0619f8945a4f'
        });
        pubnub.addListener({
            message: (message: any) => {
                console.log("New Message!!", message);
                const itineraries: Array<Itinerary> = message.message.itineraries;
                this.setState(_.extend(this.state, {itineraries: itineraries}));
            },
        });

        this.state = {
            itineraries: [],
            pnChannel: '',
            pubnub: pubnub,
        }
    }

    subscribeToChannel = (pnChannel: string) => {
        console.log('subscribeToChannel', pnChannel);
        if (pnChannel !== this.state.pnChannel) {
            this.state.pubnub.unsubscribeAll();
            this.state.pubnub.subscribe({
                channels: [pnChannel],
            });
            this.setState(_.extend(this.state, { pnChannel: pnChannel }));
        }
    }

    render() {
        return (
            <div className="container">
                <SearchBox
                    onSearchSubmit={this.subscribeToChannel}
                />
                <SearchResults
                    itineraries={this.state.itineraries}
                />
            </div>
        )
    }
}