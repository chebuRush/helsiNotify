import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

        this.handleInputValue = this.handleInputValue.bind(this);
        this.goPersonalPage = this.goPersonalPage.bind(this);
    }
    state = {
        email: '',
        password: '',
        submitted: false
    };
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
                    alert(`Login failed: ${res.data.errorHelsiMsg}`);
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
            .catch(err => {
                console.error('axios error', err.message); // eslint-disable-line no-console
            });
    }
    render() {
        const submitted = this.state.submitted
            ? <Spinner />
            : <input id="clickSubmit" type="submit" value="Спробувати" />;
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
