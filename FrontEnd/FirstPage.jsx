import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
    display:flex;
    flex-direction: column;
    align-self:center;
    font-size:7vmin;
    margin-bottom:2vh;
    font-family: 'LatoBold';
`;
const Subtitle = styled.h2`
    display:flex;
    flex-direction: column;
    align-self:center;
    font-size:4vmin;
    margin-bottom:8vmin;
    font-family: 'LatoBold';

`;

export default class FirstPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div className="main_wrap">
                <div className="bgOpac">
                    <Title>Не можеш знайти вільний час у лікаря?</Title>
                    <Subtitle>Ми зробимо це для тебе!</Subtitle>
                    <h3 className="description">
                        Helsi Notify - це платформа для зекономлення часу на очікування вільного місця до лікаря. Як тільки лікар буде вільним - ми вам про це скажемо
                    </h3>
                    <div className="form">
                        <form className="inputform" method="post" action="/send/">
                            <input type="text" placeholder="Email" required />
                            <input type="password" placeholder="Пароль" required />
                            <input id="clickSubmit" type="submit" value="Спробувати" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
