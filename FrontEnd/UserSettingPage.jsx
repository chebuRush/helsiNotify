/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

export default class UserSettingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tel: this.props.tel,
            email: this.props.email,
            moneyToPay: '',
            money: {
                available: this.props.money.available,
                freezed: this.props.money.freezed
            },
            initialValues: {
                emailToNotify: this.props.emailToNotify,
                tel: this.props.tel
            },
            payForm: '',
            loading: true
        };
        this.handleInputValue = this.handleInputValue.bind(this);
        this.handleSaveChangesButton = this.handleSaveChangesButton.bind(this);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
        this.handlePaymentConfigure = this.handlePaymentConfigure.bind(this);
    }
    componentWillMount() {
        axios
            .post('/getPersonalData')
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
            .catch(() => {
                this.props.history.push('/');
            });
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
            case 'moneyToPay': {
                return this.setState({
                    moneyToPay: event.target.value
                });
            }
            default: {
                return '';
            }
        }
    }
    handlePaymentConfigure() {
        const moneyToPay = this.state.moneyToPay;
        axios
            .post('/appReceivePayForm', { amountForPay: moneyToPay })
            .then(dataBack => {
                if (dataBack.data.statusHelsiCode === '200') {
                    this.setState(
                        {
                            payForm: dataBack.data.usefulData
                        },
                        () => {
                            document.getElementById('PayFormHTML').submit();
                        }
                    );
                }
            })
            .catch(() => {
                this.props.handleDialogBox({
                    alert: { text: `Неможливо з'єднатися. Перевірте підключення до інтернету`, color: '#ff9797' }
                });
            });
    }
    handleSaveChangesButton() {
        const self = this;
        if (
            (this.state.tel.indexOf('+38') === 0 && this.state.tel !== this.state.initialValues.tel) ||
            this.state.tel === ''
        ) {
            axios
                .post('/changePersonalData', this.state)
                .then(dataBack => {
                    if (dataBack.data.statusHelsiCode === '200') {
                        self.setState({
                            initialValues: {
                                emailToNotify: this.state.email,
                                tel: this.state.tel
                            },
                            displayTrue: ''
                        });
                    } else {
                        this.props.handleDialogBox({
                            alert: { text: `${dataBack.data.errorHelsiMsg}`, color: '#ff9797' }
                        });
                    }
                })
                .catch(() => {
                    this.props.handleDialogBox({
                        alert: { text: `Неможливо з'єднатися. Перевірте підключення до інтернету`, color: '#ff9797' }
                    });
                });
        } else {
            this.props.handleDialogBox({
                alert: { text: 'Введіть телефон у форматі: +38хххххххххх', color: '#ff9797' }
            });
        }
    }
    handleDeleteAccount() {
        const self = this;
        const confirmEmail = prompt('Для видалення аккаунту введіть пошту реєстрації');
        if (confirmEmail === self.props.email) {
            axios
                .post('/appDeleteAccount', {})
                .then(dataBack => {
                    if (dataBack.data.statusHelsiCode === '200') {
                        self.props.history.push('/');
                    } else {
                        this.props.handleDialogBox({
                            alert: { text: `Сталася помилка: ${dataBack.data.errorHelsiMsg}`, color: '#ff9797' }
                        });
                    }
                })
                .catch(() => {
                    this.props.handleDialogBox({
                        alert: { text: `Неможливо з'єднатися. Перевірте підключення до інтернету`, color: '#ff9797' }
                    });
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
                        <div className="BalanceBox">
                            Баланс
                            <div className="moneyValue">
                                Доступно: <span className="available">{this.state.money.available} грн</span>
                            </div>
                            <div className="moneyValue">
                                Заморожено: <span className="freezed">{this.state.money.freezed} грн</span>
                            </div>
                        </div>
                        <div className="PaymentBox">
                            <input
                                type="number"
                                id="moneyToPay"
                                min="0"
                                max="5000"
                                onChange={this.handleInputValue}
                                value={this.state.moneyToPay}
                            />
                            <label htmlFor="moneyToPay">&nbsp;грн</label>
                            <button onClick={this.handlePaymentConfigure}>Поповнити</button>
                            <div dangerouslySetInnerHTML={{ __html: this.state.payForm }} />
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

UserSettingPage.propTypes = {
    handleDialogBox: PropTypes.func,
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
UserSettingPage.defaultProps = {
    handleDialogBox() {},
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
