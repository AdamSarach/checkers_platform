import React from "react";
import Lobby from './Lobby'
import {Game} from "../Game";


class Authenticatedarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedScreen: 'lobby',
            opponentPlayer: '"Unknown Player"',
            isFirstPlayer: 'false',
        }
    }


    chooseScreen() {
        switch (this.state.displayedScreen) {
            case 'lobby':
                return <Lobby
                    displayedScreen={this.props.displayedScreen}
                    displayForm={this.props.displayForm}
                    setOpponent =  {this.setOpponent}
                    logged_in={this.props.logged_in}
                    user={this.props.user}
                    playGame = {this.playGame}
                    handleLogout={this.props.handleLogout}
                    getTokenFromLocal={this.props.getTokenFromLocal}
                    makeFirstPlayer = {this.makeFirstPlayer}
                />;
            case 'game':
                return <Game displayedScreen={this.displayedScreen}
                             displayForm={this.props.displayForm}
                             opponent =  {this.state.opponentPlayer}
                             goToLobby = {this.goToLobby}
                             user={this.props.user}
                             getTokenFromLocal={this.getTokenFromLocal}
                             isFirstPlayer={this.state.isFirstPlayer}
                />;
            default:
                return <Lobby
                    displayedScreen={this.props.displayedScreen}
                    displayForm={this.props.displayForm}
                    setOpponent =  {this.setOpponent}
                    logged_in={this.props.logged_in}
                    user={this.props.user}
                    playGame = {this.playGame}
                    handleLogout={this.props.handleLogout}
                    getTokenFromLocal={this.props.getTokenFromLocal}
                    makeFirstPlayer = {this.makeFirstPlayer}
                />;
        }
    }

    playGame = () => {
        this.setState({displayedScreen: 'game'})
    }

    setOpponent = (name) => {
        this.setState({opponentPlayer: name})
    }

    goToLobby = () => {
        this.setState({displayScreen: 'lobby'})
    }

    makeFirstPlayer= () => {
        this.setState({isFirstPlayer: true})
    }

    render() {
        let screen = this.chooseScreen();

        return (
            <React.Fragment>
                {screen}
            </React.Fragment>
        )
    }

}

export default Authenticatedarea;