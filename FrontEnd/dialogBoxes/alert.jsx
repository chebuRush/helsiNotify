import React from 'react';
import { PropTypes } from 'prop-types';

export default class LoadingSpinner extends React.Component {
    static propTypes = {
        alertInfo: PropTypes.string,
        alertColor: PropTypes.string
    };
    static defaultProps = {
        alertInfo: 'No information to display',
        alertColor: 'white'
    };
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="myAlert-top" style={{ backgroundColor: this.props.alertColor }}>
                <p>{this.props.alertInfo}</p>
            </div>
        );
    }
}
