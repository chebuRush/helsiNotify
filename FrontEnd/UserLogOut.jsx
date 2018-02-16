import React from 'react';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import PropTypes from 'prop-types';

export default class LoadingSpinner extends React.Component {
    static propTypes = {
        history: PropTypes.shape({
            push: PropTypes.func
        })
    };
    static defaultProps = {
        history: PropTypes.shape({
            push() {}
        })
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    componentDidMount() {
        axios
            .post('http://localhost:8090/appSignOut')
            .then(() => {
                this.props.history.push(`/`);
            })
            .catch(err => {
                // TODO tell user that something went wrong
                console.error('axios error', err); // eslint-disable-line no-console
            });
    }
    render() {
        return (
            <div className="sweet-loading">
                <PulseLoader color={'#0000c8'} loading={this.state.loading} />
            </div>
        );
    }
}
