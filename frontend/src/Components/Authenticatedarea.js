import React from "react";
import Lobby from './Lobby'
import {Game} from "../Game";


class Authenticatedarea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedScreen: 'lobby',
            opponentPlayer: '"Unknown Player"',
            isFirstPlayer: false,
            inGame: false,
            finishedGameRecently: false
        }
    }


    chooseScreen() {
        switch (this.state.displayedScreen) {
            case 'lobby':
                return <Lobby
                    displayedScreen={this.props.displayedScreen}
                    displayForm={this.props.displayForm}
                    setOpponent={this.setOpponent}
                    logged_in={this.props.logged_in}
                    user={this.props.user}
                    playGame={this.playGame}
                    handleLogout={this.props.handleLogout}
                    getTokenFromLocal={this.props.getTokenFromLocal}
                    makeFirstPlayer={this.makeFirstPlayer}
                    setGameDB={this.setGameDB}
                    finishedGameRecently={this.state.finishedGameRecently}
                    finishedGameRecentlyProp = {this.finishedGameRecentlyProp}
                />;
            case 'game':
                return <Game displayedScreen={this.displayedScreen}
                             displayForm={this.props.displayForm}
                             opponent={this.state.opponentPlayer}
                             goToLobby={this.goToLobby}
                             user={this.props.user}
                             getTokenFromLocal={this.getTokenFromLocal}
                             isFirstPlayer={this.state.isFirstPlayer}
                             setGameDB={this.setGameDB}
                />;
            default:
                return <Lobby
                    displayedScreen={this.props.displayedScreen}
                    displayForm={this.props.displayForm}
                    setOpponent={this.setOpponent}
                    logged_in={this.props.logged_in}
                    user={this.props.user}
                    playGame={this.playGame}
                    handleLogout={this.props.handleLogout}
                    getTokenFromLocal={this.props.getTokenFromLocal}
                    makeFirstPlayer={this.makeFirstPlayer}
                    setGameDB={this.setGameDB}
                    finishedGameRecently={this.state.finishedGameRecently}
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
        this.setState({
            displayedScreen: 'lobby',
            finishedGameRecently: true
        })
    }
    finishedGameRecentlyProp = (mode) => {
        this.setState({ finishedGameRecently: mode})
    }

    makeFirstPlayer = () => {
        this.setState({isFirstPlayer: true})
    }


    setGameDB = (mode) => {
        // in or out
        const partUrl = 'http://' + window.location.host + '/api-auth/'
        const url = (mode === "in") ? (partUrl + 'in_game/') : (partUrl + 'out_game/')
        return fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.props.getTokenFromLocal()}`,
                'Content-Length': 0
            },
        });
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