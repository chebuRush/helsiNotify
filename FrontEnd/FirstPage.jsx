import React from 'react';

export default class FirstPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                FirstPage
                <form>
                    <input name="lg" />
                    <input name="ps" />
                </form>
            </div>
        );
    }
}
