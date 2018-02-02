import React from 'react';
import PropTypes from 'prop-types';

export default class OneDoctor extends React.Component {
    static propTypes = {
        doctorLink: PropTypes.string,
        dateFrom: PropTypes.string,
        dateTo: PropTypes.string,
        doctorIdForUser: PropTypes.string,
        deleteDoctorNotification: PropTypes.func
    };
    static defaultProps = {
        doctorIdForUser: '',
        doctorLink: '',
        dateFrom: '',
        dateTo: '',
        deleteDoctorNotification() {}
    };
    constructor(props) {
        super(props);
        this.state = {};
        this.crossClicked = this.crossClicked.bind(this);
    }
    crossClicked() {
        const readyToDelete = confirm('Ви впевнені, що хочете видалити лікаря?');
        if (readyToDelete) {
            console.log(this.props.deleteDoctorNotification);
            this.props.deleteDoctorNotification(this.props.doctorIdForUser);
        }
        this.setState({});
    }
    render() {
        return (
            <div className="oneDoctor">
                <div className="doctorSeparateData"><p>{this.props.doctorLink}</p></div>
                <div className="doctorSeparateData"><p>{this.props.dateFrom}</p></div>
                <div className="doctorSeparateData"><p>{this.props.dateTo}</p></div>
                <div className="doctorSeparateData red-cross-div">
                    <button className="close" type="text" onClick={this.crossClicked}>X</button>
                </div>
            </div>
        );
    }
}
