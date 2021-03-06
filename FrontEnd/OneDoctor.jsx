import React from 'react';
import PropTypes from 'prop-types';

export default class OneDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.crossClicked = this.crossClicked.bind(this);
    }
    crossClicked() {
        this.props.handleDialogBox({
            confirm: {
                text: `Ви впевнені, що хочете видалити лікаря?`,
                color: '#1399E2',
                chooseYes: () => {
                    this.props.deleteDoctorNotification(this.props.doctorIdForUser);
                },
                chooseNo: () => {}
            }
        });
    }
    /*
* Doctor status
* 0 - Stopped for looking for
* 1 - Looking for
* 2 - Founded & Notified
* 3 - Overdue time limit
*/
    render() {
        let statusText;
        switch (this.props.status) {
            case 0:
                statusText = 'Пошук зупинено';
                break;
            case 1:
                statusText = 'Шукаємо';
                break;
            case 2:
                statusText = 'Успішно знайдено';
                break;
            case 3:
                statusText = 'Вичерпано час пошуку';
                break;
            default:
                statusText = 'Невідомо';
                break;
        }
        return (
            <div className="oneDoctor">
                <div className="doctorSeparateData"><p>{this.props.doctorLink}</p></div>
                <div className="doctorSeparateData"><p>{this.props.dateFrom}</p></div>
                <div className="doctorSeparateData"><p>{this.props.dateTo}</p></div>
                <div className="doctorSeparateData"><p>{statusText}</p></div>
                <div className="doctorSeparateData red-cross-div">
                    <button className="close" type="text" onClick={this.crossClicked}>X</button>
                </div>
            </div>
        );
    }
}

OneDoctor.propTypes = {
    doctorLink: PropTypes.string,
    handleDialogBox: PropTypes.func,
    status: PropTypes.number,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
    doctorIdForUser: PropTypes.string,
    deleteDoctorNotification: PropTypes.func
};
OneDoctor.defaultProps = {
    handleDialogBox() {},
    doctorIdForUser: '',
    status: 1,
    doctorLink: '',
    dateFrom: '',
    dateTo: '',
    deleteDoctorNotification() {}
};
