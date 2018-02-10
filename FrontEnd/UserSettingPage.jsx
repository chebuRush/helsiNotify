import React from 'react';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

export default class UserSettingPage extends React.Component {
    static propTypes = {
        money: PropTypes.shape({
            available: PropTypes.string,
            freezed: PropTypes.string
        }),
        email: PropTypes.string,
        tel: PropTypes.string,
        history: PropTypes.shape({
            push: PropTypes.func
        }),
        emailToNotify: PropTypes.string
    };
    static defaultProps = {
        money: PropTypes.shape({
            available: '0',
            freezed: '0'
        }),
        email: '',
        tel: 'Відсутній',
        history: {
            push() {}
        },
        emailToNotify: ''
    };
    constructor(props) {
        super(props);
        this.state = {
            tel: this.props.tel,
            email: this.props.email,
            money: {
                available: this.props.money.available,
                freezed: this.props.money.freezed
            },
            initialValues: {
                emailToNotify: this.props.emailToNotify,
                tel: this.props.tel
            },
            loading: true
        };
        this.handleInputValue = this.handleInputValue.bind(this);
        this.handleSaveChangesButton = this.handleSaveChangesButton.bind(this);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    }
    componentWillMount() {
        axios
            .post('http://localhost:8090/getPersonalData')
            .then(dataBack => {
                if (dataBack.data.email) {
                    const telForState = dataBack.data.personalData.tel ? dataBack.data.personalData.tel : '';
                    const emailToNotifyForState = dataBack.data.personalData.emailToNotify
                        ? dataBack.data.personalData.emailToNotify
                        : '';
                    this.setState({
                        tel: telForState,
                        emailToNotify: emailToNotifyForState,
                        money: {
                            available: dataBack.data.personalData.money.available,
                            freezed: dataBack.data.personalData.money.freezed
                        },
                        initialValues: {
                            emailToNotify: emailToNotifyForState,
                            tel: telForState
                        },
                        displayTrue: '',
                        loading: false
                    });
                } else {
                    this.props.history.push('/');
                }
            })
            .catch(err => {
                // TODO tell user that something went wrong
                console.error('axios error', err); // eslint-disable-line no-console
                this.props.history.push('/');
            });
        // TODO delete setTimeout and rewrite axios to sync query
    }
    handleInputValue(event) {
        switch (event.target.id) {
            case 'emailNotify': {
                const displayTrue = this.state.initialValues.emailToNotify === event.target.value &&
                    this.state.initialValues.tel === this.state.tel
                    ? ''
                    : 'displayTrue';
                return this.setState({
                    emailToNotify: event.target.value,
                    displayTrue
                });
            }
            case 'telNotify': {
                const displayTrue = this.state.initialValues.tel === event.target.value &&
                    this.state.initialValues.emailToNotify === this.state.emailToNotify
                    ? ''
                    : 'displayTrue';
                return this.setState({
                    tel: event.target.value,
                    displayTrue
                });
            }
            default: {
                return '';
            }
        }
    }
    handleSaveChangesButton() {
        const self = this;
        axios
            .post('http://localhost:8090/changePersonalData', this.state)
            .then(dataBack => {
                if (dataBack.data.statusHelsiCode === '200') {
                    self.setState({
                        initialValues: {
                            emailToNotify: this.state.email,
                            tel: this.state.tel
                        },
                        displayTrue: ''
                    });
                }
            })
            .catch(err => {
                // TODO tell user that something went wrong
                console.error('axios error', err); // eslint-disable-line no-console
            });
        // TODO delete setTimeout and rewrite axios to sync query
    }
    handleDeleteAccount() {
        const self = this;
        const confirmEmail = prompt('Для видалення аккаунту введіть пошту реєстрації');
        if (confirmEmail === self.props.email) {
            axios
                .post('http://localhost:8090/appDeleteAccount', {})
                .then(dataBack => {
                    if (dataBack.data.statusHelsiCode === '200') {
                        self.props.history.push('/');
                    } else {
                        alert('Something goes wrong: ', dataBack.data.errorHelsiMsg);
                    }
                })
                .catch(err => {
                    // TODO tell user that something went wrong
                    console.error('axios error', err); // eslint-disable-line no-console
                });
        }
    }
    render() {
        if (this.state.loading) {
            return (
                <div className="sweet-loading" align="center">
                    <PulseLoader color={'#0000c8'} loading={this.state.loading} />
                </div>
            );
        }
        return (
            <div className="doctorListWrapper">
                <div className="bgOpac userSettingBlock">
                    <div className={`SaveChangesButtonWrapper ${this.state.displayTrue}`}>
                        <button className="SaveChangesButton" onClick={this.handleSaveChangesButton}>
                            Зберегти зміни
                        </button>
                    </div>
                    <div className="PersonalDataField">
                        <div>
                            Баланс
                            <div className="moneyValue">
                                Доступно: <span className="available">{this.state.money.available} грн</span>
                            </div>
                            <div className="moneyValue">
                                Заморожено: <span className="freezed">{this.state.money.freezed} грн</span>
                            </div>
                        </div>
                    </div>
                    <div className="PersonalDataField">
                        <p>Пошта для повідомлень:</p>
                        <input
                            type="email"
                            name="EmailNotification"
                            id="emailNotify"
                            placeholder={this.state.initialValues.emailToNotify}
                            value={this.state.emailToNotify}
                            onChange={this.handleInputValue}
                        />
                    </div>
                    <div className="PersonalDataField">
                        <p>Телефон для повідомлень:</p>
                        <input
                            type="tel"
                            name="Telephone"
                            id="telNotify"
                            placeholder={this.state.initialValues.tel}
                            value={this.state.tel}
                            onChange={this.handleInputValue}
                        />
                    </div>
                    <div className="PersonalDataField">
                        <button className="DeleteAccount" onClick={this.handleDeleteAccount}>Видалити аккаунт</button>
                    </div>
                </div>
            </div>
        );
    }
}
