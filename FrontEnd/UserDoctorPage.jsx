import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import OneDoctor from './OneDoctor';

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
        const httprequest = self.state.doctorLink;
        if (httprequest.indexOf('https://helsi.me/') === 0) {
            if (self.state.dateFrom === '' || self.state.dateTo === '') {
                this.props.handleDialogBox({
                    alert: {
                        text: `Всі поля повинні бути заповнені`,
                        color: '#ff9797'
                    }
                });
            } else {
                this.props.handleDialogBox({
                    confirm: {
                        text: `Додавання доктора платне: ${this.props.ONE_DOCTOR_VISIT_COST} грн будуть заморожені. Ви згодні?`,
                        color: '#1399E2',
                        chooseYes: () => {
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
                                .post('/addDoctor', objToSend)
                                .then(dataBack => {
                                    if (dataBack.data.statusHelsiCode !== '200') {
                                        this.props.handleDialogBox({
                                            alert: {
                                                text: `Доктора не вдалося додати: Недостатньо коштів!`,
                                                color: '#ff9797'
                                            }
                                        });
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
                                .catch(() => {
                                    this.props.handleDialogBox({
                                        alert: {
                                            text: `Неможливо з'єднатися. Перевірте підключення до інтернету`,
                                            color: '#ff9797'
                                        }
                                    });
                                });
                        },
                        chooseNo: () => {}
                    }
                });
            }
        } else {
            this.props.handleDialogBox({
                alert: {
                    text: `Адреса повинна починатися з https://helsi.me/`,
                    color: '#ff9797'
                }
            });
        }
    }
    deleteDoctorNotification(id) {
        const newDoctorsArr = Object.assign({}, this.props.doctorsArr);
        delete newDoctorsArr[id];
        axios
            .post('/deleteDoctor', { id })
            .then(dataBack => {
                if (dataBack.data.statusHelsiCode === '200') {
                    this.props.changeDoctorState(newDoctorsArr);
                } else if (dataBack.data.statusHelsiCode === '403') {
                    this.props.handleDialogBox({
                        confirm: {
                            text: `${dataBack.data.errorHelsiMsg}. Ви впевнені?`,
                            color: '#1399E2',
                            chooseYes: () => {
                                const removeAnyway = true;
                                axios
                                    .post('/deleteDoctor', { id, removeAnyway })
                                    .then(() => {
                                        console.log('here3');
                                        this.props.changeDoctorState(newDoctorsArr);
                                    })
                                    .catch(e => {
                                        throw e;
                                    });
                            },
                            chooseNo: () => {
                                console.log('No pressed');
                            }
                        }
                    });
                }
            })
            .catch(() => {
                this.props.handleDialogBox({
                    alert: { text: `Неможливо з'єднатися. Перевірте підключення до інтернету`, color: '#ff9797' }
                });
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
                        handleDialogBox={this.props.handleDialogBox}
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

UserDoctorPage.propTypes = {
    handleDialogBox: PropTypes.func,
    doctorsArr: PropTypes.shape({}),
    changeDoctorState: PropTypes.func,
    ONE_DOCTOR_VISIT_COST: PropTypes.string
};
UserDoctorPage.defaultProps = {
    handleDialogBox() {},
    doctorsArr: {},
    ONE_DOCTOR_VISIT_COST: '0',
    changeDoctorState() {}
};
