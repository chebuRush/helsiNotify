import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import OneDoctor from './OneDoctor';

export default class UserDoctorPage extends React.Component {
    static getCurrentDate() {
        return `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}`;
    }
    static propTypes = {
        doctorsArr: PropTypes.shape({}),
        changeDoctorState: PropTypes.func
    };
    static defaultProps = {
        doctorsArr: {},
        changeDoctorState() {}
    };
    constructor(props) {
        super(props);
        this.state = {
            doctorLink: '',
            dateFrom: UserDoctorPage.getCurrentDate(),
            dateTo: ''
        };
        this.handleInputValue = this.handleInputValue.bind(this);
        this.addDoctorNotification = this.addDoctorNotification.bind(this);
        this.deleteDoctorNotification = this.deleteDoctorNotification.bind(this);
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
    addDoctorNotification(event) {
        const self = this;
        event.preventDefault();
        const objToSend = Object.assign(
            {},
            {
                doctorLink: self.state.doctorLink,
                dateFrom: self.state.dateFrom,
                dateTo: self.state.dateTo,
                status: 1,
                userGenId: Math.round(Math.random() * Number.MAX_SAFE_INTEGER)
            }
        );
        axios
            .post('http://localhost:8090/addDoctor', objToSend)
            .then(dataBack => {
                if (dataBack.data.statusHelsiCode !== '200') {
                    alert(`Доктора не вдалося додати: ${dataBack.data.errorHelsiMsg}`);
                } else {
                    const NewDoctorsArr = Object.assign({}, this.props.doctorsArr, {
                        [objToSend.userGenId]: {
                            doctorLink: self.state.doctorLink,
                            dateFrom: self.state.dateFrom,
                            dateTo: self.state.dateTo,
                            status: 1
                        }
                    });
                    this.props.changeDoctorState(NewDoctorsArr);
                }
            })
            .catch(err => {
                console.error('axios error', err); // eslint-disable-line no-console
            });
    }
    deleteDoctorNotification(id) {
        const newDoctorsArr = this.props.doctorsArr;
        delete newDoctorsArr[id];
        axios
            .post('http://localhost:8090/deleteDoctor', { id })
            .then(dataBack => {
                if (dataBack.data.statusHelsiCode === '200') {
                    this.props.changeDoctorState(newDoctorsArr);
                } else if (dataBack.data.statusHelsiCode === '403') {
                    const removeAnyway = confirm(`${dataBack.data.errorHelsiMsg}. Ви впевнені?`);
                    if (removeAnyway) {
                        axios
                            .post('http://localhost:8090/deleteDoctor', { id, removeAnyway })
                            .then(() => {
                                this.props.changeDoctorState(newDoctorsArr);
                                console.log('second request');
                            })
                            .catch(e => {
                                throw e;
                            });
                    }
                }
            })
            .catch(err => {
                // TODO tell user that something went wrong
                console.error('axios error', err); // eslint-disable-line no-console
            });
    }
    render() {
        let listOfDoctors;
        if (this.props.doctorsArr) {
            listOfDoctors = Object.keys(this.props.doctorsArr).map(doctorIdForUser => {
                const doc = this.props.doctorsArr[doctorIdForUser];
                return (
                    <OneDoctor
                        key={doctorIdForUser}
                        doctorIdForUser={doctorIdForUser}
                        dateFrom={doc.dateFrom}
                        dateTo={doc.dateTo}
                        status={doc.status}
                        doctorLink={doc.doctorLink}
                        deleteDoctorNotification={this.deleteDoctorNotification}
                    />
                );
            });
        }
        return (
            <div className="doctorListWrapper">
                <div className="wishForm">
                    <input
                        id="doctorLink"
                        type="url"
                        onChange={this.handleInputValue}
                        name="DoctorLink"
                        placeholder="Посилання на доктора (https://helsi.me/doctor/shv_200)"
                        value={this.state.doctorLink}
                        required
                    />
                    <input
                        onChange={this.handleInputValue}
                        required
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
                        required
                        placeholder="Дата по"
                    />
                    <input
                        id="clickSubmit"
                        type="submit"
                        value="Отримати сповіщення"
                        onClick={this.addDoctorNotification}
                    />
                </div>
                <div className="showAllNotifyWishes">
                    {/* TODO in response we got userDoctors, map them and show into a table */}
                    {listOfDoctors}
                </div>
            </div>
        );
    }
}
