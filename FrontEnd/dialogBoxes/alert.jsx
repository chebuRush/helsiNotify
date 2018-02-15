import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = props => (
    <div className="myAlert-top" style={{ backgroundColor: props.alertColor }}>
        <p>{props.alertInfo}</p>
    </div>
);
AlertBox.propTypes = {
    alertInfo: PropTypes.string,
    alertColor: PropTypes.string
};
AlertBox.defaultProps = {
    alertInfo: '',
    alertColor: '#ff9797'
};

export default AlertBox;
