import React from 'react';
import { PulseLoader } from 'react-spinners';

export default class LoadingSpinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    render() {
        return (
            <div className="sweet-loading">
                <PulseLoader color={'#0000c8'} loading={this.state.loading} />
            </div>
        );
    }
}
