import React from 'react';

export default class UserDoctorPage extends React.Component {
    static getCurrentDate() {
        return `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`;
    }
    constructor(props) {
        super(props);
        this.state = {
            doctorLink: '',
            dateFrom: UserDoctorPage.getCurrentDate(),
            dateTo: ''
        };
        this.handleInputValue = this.handleInputValue.bind(this);
    }
    handleInputValue(event) {
        switch (event.target.id) {
            case 'doctorLink': {
                return this.setState({
                    doctorLink: event.target.value
                });
            }
            case 'dateFrom': {
                return this.setState({
                    dateFrom: event.target.value
                });
            }
            case 'dateTo': {
                return this.setState({
                    dateTo: event.target.value
                });
            }
            default: {
                return '';
            }
        }
    }
    render() {
        return (
            <div className="doctorListWrapper">
                <div className="wishForm">
                    <input
                        id="doctorLink"
                        type="text"
                        onChange={this.handleInputValue}
                        name="DoctorLink"
                        placeholder="Doctor's link (ex. https://helsi.me/doctor/shv_200)"
                        value={this.state.doctorLink}
                        required
                    />
                    <input
                        onChange={this.handleInputValue}
                        id="dateFrom"
                        type="date"
                        name="DateFrom"
                        placeholder="Дата з"
                        value={this.state.dateFrom}
                        min={UserDoctorPage.getCurrentDate()}
                    />
                    <input
                        onChange={this.handleInputValue}
                        id="dateTo"
                        type="date"
                        value={this.state.dateTo}
                        name="DateTo"
                        placeholder="Дата по"
                    />
                    <input id="clickSubmit" type="submit" value="Receive notification" />
                </div>
                <div className="showAllNotifyWishes">
                    AllDoctors
                </div>
            </div>
        );
    }
}
