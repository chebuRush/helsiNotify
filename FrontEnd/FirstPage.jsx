/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import PropTypes from 'prop-types';

import Spinner from './Spinner';

const Title = styled.h1`
    display:flex;
    flex-direction: column;
    align-self:center;
    font-size:7vmin;
    margin-bottom:2vh;
    font-family: 'LatoBold';
    text-align:center;
`;

const Subtitle = styled.h2`
    display:flex;
    flex-direction: column;
    align-self:center;
    font-size:4vmin;
    margin-bottom:8vmin;
    font-family: 'LatoBold';
    text-align:center;
`;

export default class FirstPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            submitted: false
        };

        this.handleInputValue = this.handleInputValue.bind(this);
        this.goPersonalPage = this.goPersonalPage.bind(this);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
    }

    handleInputValue(event) {
        switch (event.target.id) {
            case 'password': {
                return this.setState({
                    password: event.target.value
                });
            }
            case 'email': {
                return this.setState({
                    email: event.target.value
                });
            }
            default: {
                return '';
            }
        }
    }
    handleForgotPassword() {
        const email = prompt('Введіть ваш email для відновлення паролю');
        if (email) {
            this.setState({
                submitted: true
            });
            axios
                .post('http://localhost:8090/appForgetPassword', { email })
                .then(res => {
                    if (res.data.statusHelsiCode === '200') this.setState({ submitted: false });
                })
                .catch(e => {
                    this.props.handleDialogBox({
                        alert: { text: `Сталася помилка: ${e.message}`, color: '#ff9797' }
                    });
                    this.setState({
                        submitted: false
                    });
                });
        }
    }
    goPersonalPage(event) {
        event.preventDefault();
        this.setState(
            {
                submitted: true
            },
            () => {
                this.forceUpdate();
            }
        );
        axios
            .post('http://localhost:8090/appSignIn', this.state)
            .then(res => {
                if (res.data.statusHelsiCode === '200') {
                    // eslint-disable-next-line react/prop-types
                    this.props.history.push(`/user/${res.data.user.uid}/notify`, res.data.user);
                } else {
                    this.props.handleDialogBox({
                        alert: { text: `Не вдалося увійти: ${res.data.errorHelsiMsg}`, color: '#ff9797' }
                    });
                    this.setState(
                        {
                            submitted: false
                        },
                        () => {
                            this.forceUpdate();
                        }
                    );
                }
            })
            .catch(() => {
                this.props.handleDialogBox({
                    alert: { text: `Неможливо з'єднатися. Перевірте підключення до інтернету`, color: '#ff9797' }
                });
                this.setState({
                    submitted: false
                });
            });
    }
    render() {
        const submitted = this.state.submitted
            ? <Spinner />
            : <div className="submitButtonBlock">
                  <input id="clickSubmit" type="submit" value="Спробувати" />
                  <div className="forgotPassword" onClick={this.handleForgotPassword}>Забув пароль?</div>
              </div>;
        return (
            <div className="bgOpac">
                <Title>Не можеш знайти вільний час у лікаря?</Title>
                <Subtitle>Ми зробимо це для тебе!</Subtitle>
                <h3 className="description">
                    Helsi Notify - це платформа для заощадження часу на очікування вільного місця до лікаря. Як тільки лікар буде вільним - ми вас повідомимо
                </h3>
                <div className="form">
                    <form className="inputform" method="post" onSubmit={this.goPersonalPage}>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={this.state.email}
                            required
                            onChange={this.handleInputValue}
                        />
                        <input
                            type="password"
                            id="password"
                            placeholder="Пароль"
                            value={this.state.password}
                            required
                            onChange={this.handleInputValue}
                        />
                        {submitted}
                    </form>
                </div>
            </div>
        );
    }
}

FirstPage.propTypes = {
    handleDialogBox: PropTypes.func
};
FirstPage.defaultProps = {
    handleDialogBox() {}
};
