import React from 'react';
import PropTypes from 'prop-types';

const ConfirmBox = props => {
    function chooseYes() {
        props.chooseYes();
        props.closeConfirm();
    }

    function chooseNo() {
        props.chooseNo();
        props.closeConfirm();
    }
    return (
        <div>
            <div className="myConfirm-overlay" />
            <div className="myConfirm-top" style={{ backgroundColor: props.confirmColor }}>
                <p>{props.confirmInfo}</p>
                <div className="ChooseButtons">
                    <input type="button" className="YesButton" value="Так" onClick={chooseYes} />
                    <input type="button" className="NoButton" value="Ні" onClick={chooseNo} />
                </div>
            </div>
        </div>
    );
};

ConfirmBox.propTypes = {
    confirmColor: PropTypes.string,
    confirmInfo: PropTypes.string,
    // eslint-disable-next-line react/no-unused-prop-types
    chooseYes: PropTypes.func,
    closeConfirm: PropTypes.func,
    chooseNo: PropTypes.func
};

ConfirmBox.defaultProps = {
    confirmInfo: '',
    confirmColor: '#ff8315',
    chooseYes() {},
    chooseNo() {},
    closeConfirm() {}
};

export default ConfirmBox;
