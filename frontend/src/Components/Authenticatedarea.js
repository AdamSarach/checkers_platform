import React from "react";
import Chatwindow from "./Chatwindow";
import Lobby from './Lobby'


class Authenticatedarea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Lobby
                    displayForm={this.props.displayForm}
                    logged_in={this.props.logged_in}
                    user={this.props.username}
                    handleLogout={this.props.handleLogout}
                    getTokenFromLocal={this.props.getTokenFromLocal}/>
                />
            </div>
        )
    }

}

export default Authenticatedarea;