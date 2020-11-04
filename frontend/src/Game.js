import React from 'react';
import {returnPlayerName} from './utils.js';
import {ReactCheckers} from './ReactCheckers.js';
import Board from './Board.js';


export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.columns = this.setColumns();
        this.ReactCheckers = new ReactCheckers(this.columns);
        this.state = {
            players: 2,
            history: [{
                boardState: this.createBoard(),
                currentPlayer: true,
            }],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
            turn: '',
            gameStatus: ((this.props.isFirstPlayer) ? "Move your piece" : "Wait for opponent move"),
            winnerInfo: null,
            newGameRequest: false,
            isGameBlocked: false,
            isOpponentInGame: false
        }
    }

    componentDidMount() {
        this.assignTurn();

        //Game Socket  ->>>>>
        const enemy = this.props.user
        this.gameSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/game/'
            + enemy
            + '/'
        );

        this.gameSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.group("GameMessage")
            console.log("message received");
            console.log("DATA", data);
            if ('button_message' in data) {
                console.log("button_message: ", data.button_message);
                switch (data['button_message']) {
                    case "giveUp":
                        this.turnGiveUpButton(false);
                        this.turnLobbyButton(true);
                        this.turnPlayAgainButton(true);
                        this.shouldGameBlocked(true);
                        this.setState({gameStatus: "Opponent has given up. You win!"})
                        break;
                    case "lobby":
                        this.turnGiveUpButton(false);
                        this.turnLobbyButton(true);
                        this.turnPlayAgainButton(false);
                        this.setState({
                            gameStatus: "Opponent has has moved into lobby.",
                            isOpponentInGame: false
                        })
                        break;
                    case "newGame":
                        this.turnGiveUpButton(false);
                        this.turnLobbyButton(false);
                        this.turnPlayAgainButton(false);
                        this.setState({
                            newGameRequest: true
                        })
                        break;
                }
            } else if ("yes_no_message" in data) {
                console.log("yes_no_button received");
                if (data.yes_no_message === true) {
                    this.getInitialState()
                } else {
                    this.turnLobbyButton(true);
                    this.turnPlayAgainButton(true);
                }
            } else {
                console.log("normal state received");
                console.groupEnd();
                const game = data.game_state;
                let history = this.state.history;
                history.push(data.history);
                this.setState({
                    'history': history,
                    'activePiece': null,
                    'moves': game.moves,
                    'jumpKills': game.jumpKills,
                    'hasJumped': game.hasJumped,
                    'stepNumber': game.stepNumber,
                    'winner': game.winner,
                    'turn': data.turn
                })
                this.adjustGameStatus(data.history);
                if (game.winner !== null) {
                    this.setWinnerInfo(game.winner);
                }
            }

        }

        this.gameSocket.onclose = function (e) {
            console.error('Game socket closed unexpectedly');
        };
        //<<<<- Game Socket
    }

    turnGiveUpButton = (buttonState) => {
        const giveUpButton = document.getElementById("giveUpButton");
        if (buttonState === true) {
            giveUpButton.className = "btn btn-sm btn-success";
        } else {
            giveUpButton.className = "btn btn-sm btn-success disabled";
        }
    }

    turnLobbyButton = (buttonState) => {
        const lobbyButton = document.getElementById("lobbyButton");
        if (buttonState === true) {
            lobbyButton.className = "btn btn-sm btn-success";
        } else {
            lobbyButton.className = "btn btn-sm btn-success disabled";
        }
    }

    turnPlayAgainButton = (buttonState) => {
        const playAgainButton = document.getElementById("playAgainButton");
        if (buttonState === true) {
            playAgainButton.className = "btn btn-sm btn-success";
        } else {
            playAgainButton.className = "btn btn-sm btn-success disabled";
        }
    }

    handleGiveUpButton = () => {
        this.turnGiveUpButton(false);
        this.turnLobbyButton(true);
        this.turnPlayAgainButton(true);
        this.shouldGameBlocked(true);
        this.setState({gameStatus: "You have given up!"})
        this.sendButtonMessage('giveUp');
    }

    goToLobbyButton = () => {
        this.sendButtonMessage('lobby');
        try {
            this.gameSocket.close()
        } catch (error) {
            console.log("Game ended properly")
        }
        this.props.setGameDB("out")
            .then(() => {
                this.props.goToLobby();
            })
    }

    playAgainButton = () => {
        console.log("You want to play again")
        this.turnPlayAgainButton(false);
        this.sendButtonMessage('newGame');

    }

    sendButtonMessage = (strategy) => {
        console.log("direct before socket send")
        this.gameSocket.send(JSON.stringify({
            'userSender': this.props.user,
            'user': this.props.opponent,
            'buttonMessage': strategy
        }));
        console.log("direct after socket send")
    }

    getInitialState = () => {
        this.turnGiveUpButton(true);
        this.turnLobbyButton(false);
        this.turnPlayAgainButton(false);
        this.setState({
            players: 2,
            history: [{
                boardState: this.createBoard(),
                currentPlayer: true,
            }],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
            turn: '',
            gameStatus: ((this.props.isFirstPlayer) ? "Move your piece" : "Wait for opponent move"),
            winnerInfo: null,
            newGameRequest: false,
            isGameBlocked: false
        })


    }

    handleNewGame = (strategy) => {
        this.gameSocket.send(JSON.stringify({
            'userSender': this.props.user,
            'user': this.props.opponent,
            'yesNoButton': strategy
        }));
        this.setState({
            newGameRequest: false
        })
    }

    yesButtonClick = () => {
        this.getInitialState();
        this.handleNewGame(true);
    }

    noButtonClick = () => {
        this.turnLobbyButton(true);
        this.turnPlayAgainButton(true);
        this.handleNewGame(false);
    }

    shouldGameBlocked = (strategy) => {
        this.setState({isGameBlocked: strategy})
    }


    assignTurn = () => {
        this.props.isFirstPlayer ? this.setState({turn: true}) : this.setState({turn: false})
    }


    setColumns() {
        const columns = {};
        columns.a = 0;
        columns.b = 1;
        columns.c = 2;
        columns.d = 3;
        columns.e = 4;
        columns.f = 5;
        columns.g = 6;
        //keep last column to be named "i", instead of "h", otherwise bootstrap will expand last column in weird way
        columns.i = 7;

        return columns;
    }

    createBoard() {
        let board = {};
        for (let key in this.columns) {
            if (this.columns.hasOwnProperty(key)) {
                for (let n = 1; n <= 8; ++n) {
                    let row = key + n;
                    board[row] = null;
                }
            }
        }
        board = this.initPlayers(board);
        return board;
    }

    initPlayers(board) {
        const player1 = ['a8', 'c8', 'e8', 'g8', 'b7', 'd7', 'f7', 'i7', 'a6', 'c6', 'e6', 'g6',];
        const player2 = ['b3', 'd3', 'f3', 'i3', 'a2', 'c2', 'e2', 'g2', 'b1', 'd1', 'f1', 'i1',];
        let self = this;
        player1.forEach(function (i) {
            board[i] = self.createPiece(i, 'player1');
        });
        player2.forEach(function (i) {
            board[i] = self.createPiece(i, 'player2');
        });
        return board;
    }

    createPiece(location, player) {
        let piece = {};
        piece.player = player;
        piece.location = location;
        piece.isKing = false;
        return piece;
    }

    getCurrentState() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        return history[history.length - 1];
    }

    handleClick(coordinates) {

        if (this.state.turn === false && this.state.moves.length === 0) {
            return console.log("Turn raised");
        }

        if (this.state.winner !== null) {
            this.setWinnerInfo(this.state.winner);
            return console.log("Winner raised");
        }

        if (this.state.isGameBlocked === true) {
            return;
        }

        const currentState = this.getCurrentState();
        const boardState = currentState.boardState;
        const clickedSquare = boardState[coordinates];

        // Clicked on a piece
        if (clickedSquare !== null) {

            // Can't select opponents pieces
            if (clickedSquare.player !== returnPlayerName(currentState.currentPlayer)) {
                return console.log("Opponent piece raised");
            }

            // Unset active piece if it's clicked
            if (this.state.activePiece === coordinates && this.state.hasJumped === null) {
                this.setState({
                    activePiece: null,
                    moves: [],
                    jumpKills: null,
                });
                return console.log("Unset active piece raised");
            }

            // Can't choose a new piece if player has already jumped.
            if (this.state.hasJumped !== null && boardState[coordinates] !== null) {
                return console.log("Already jumped raised");
            }

            // Set active piece
            let movesData = this.ReactCheckers.getMoves(boardState, coordinates, clickedSquare.isKing, false);

            this.setState({
                activePiece: coordinates,
                moves: movesData[0],
                jumpKills: movesData[1],
            });

            return;
        }

        // Clicked on an empty square
        if (this.state.activePiece === null) {
            return;
        }

        // Moving a piece
        if (this.state.moves.length > 0) {
            const postMoveState = this.ReactCheckers.movePiece(coordinates, this.state);

            if (postMoveState === null) {
                return;
            }

            this.updateStatePostMove(postMoveState);

        }
    }

    sendGameSocket = (history, activePiece, moves, jumpKills, hasJumped, stepNumber, winner, turn) => {
        const latestHistory = history[history.length - 1];
        this.adjustGameStatus(latestHistory);
        this.gameSocket.send(JSON.stringify({
            'userSender': this.props.user,
            'user': this.props.opponent,
            'gameState': {
                'history': latestHistory,
                'activePiece': activePiece,
                'moves': moves,
                'jumpKills': jumpKills,
                'hasJumped': hasJumped,
                'stepNumber': stepNumber,
                'winner': winner,

            },
            'turn': turn
        }));
    }

    updateStatePostMove(postMoveState) {
        this.setState({
                history: this.state.history.concat([{
                    boardState: postMoveState.boardState,
                    currentPlayer: postMoveState.currentPlayer,
                }]),
                activePiece: postMoveState.activePiece,
                moves: postMoveState.moves,
                jumpKills: postMoveState.jumpKills,
                hasJumped: postMoveState.hasJumped,
                stepNumber: this.state.history.length,
                winner: postMoveState.winner,
                turn: false
            },
            () => this.sendGameSocket(this.state.history, this.state.activePiece, this.state.moves,
                this.state.jumpKills, this.state.hasJumped, this.state.stepNumber, this.state.winner, !this.state.turn)
        );
        if (postMoveState.winner !== null) {
            this.setWinnerInfo(postMoveState.winner);
        }
    }


    setPlayers(players) {
        this.setState({
            players: players,
        })
    }

    setBorderColor = () => {
        if (this.state.winner) {
            return '#262626'
        }
        const shouldBorderColorRed = this.state.history[this.state.history.length - 1].currentPlayer;
        return (shouldBorderColorRed) ? '#cd3532' : '#0c9d94'
    }

    setWinnerInfo = (winner) => {
        this.turnGiveUpButton(false);
        this.turnLobbyButton(true);
        this.turnPlayAgainButton(true);

        if (winner === 'player1pieces' || winner === 'player1moves') {
            this.setState({winnerInfo: this.props.isFirstPlayer ? "You win!" : `${this.props.opponent} wins!`})
        } else if (winner === 'player2pieces' || winner === 'player2moves') {
            this.setState({winnerInfo: this.props.isFirstPlayer ? `${this.props.opponent} wins!` : "You win!"})
        } else {
            console.warn("setWinnerInfo warning")
        }
    }

    adjustGameStatus = (history) => {
        try {
            const whoPlays = history.currentPlayer;
            if (this.props.isFirstPlayer) {
                if (!!whoPlays) {
                    this.setState({gameStatus: "Your move"});
                } else {
                    this.setState({gameStatus: `${this.props.opponent}'s move`});
                }
            } else {
                if (!!whoPlays) {
                    this.setState({gameStatus: `${this.props.opponent}'s move`});
                } else {
                    this.setState({gameStatus: "Your move"});
                }
            }
        } catch (error) {
            console.log(error);
            return "Start"
        }
    }

    render() {
        const columns = this.columns;
        const stateHistory = this.state.history;
        const activePiece = this.state.activePiece;
        const currentState = stateHistory[this.state.stepNumber];
        const boardState = currentState.boardState;
        const currentPlayer = currentState.currentPlayer;
        const moves = this.state.moves;
        const gameStatus = this.state.gameStatus

        return (

            <div className="game-page website-styles center-main-container ">

                <div className="flex-wrapper border-padding btn-group">
                    <div style={{flex: 3}}>
                        <button id="giveUpButton" className="btn btn-sm btn-success"
                                onClick={this.handleGiveUpButton}>Give up
                        </button>
                    </div>
                    <div style={{flex: 3}}>
                        <button id="lobbyButton" className="btn btn-sm btn-success disabled"
                                onClick={() => this.goToLobbyButton()}>Exit to
                            lobby
                        </button>
                    </div>
                    <div style={{flex: 3}}>
                        <button id="playAgainButton" className="btn btn-sm btn-success disabled"
                                onClick={this.playAgainButton}>Ask to play
                            again
                        </button>
                    </div>
                </div>
                <div>
                    You are playing against {this.props.opponent}
                </div>
                <div>
                    {this.state.newGameRequest &&
                    <div style={{flex: 7}}>
                        Opponent wants to play again
                        <button id="yes-button"
                                className="btn btn-sm btn-outline-success"
                                onClick={(e) => {
                                    this.yesButtonClick(e)
                                }}
                        >Yes</button>
                        <button id="no-button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                    this.noButtonClick(e)
                                }}
                        >No
                        </button>
                    </div>}
                </div>


                <div className="reactCheckers">
                    <div className="game-status" id="game-status">
                        {this.state.winnerInfo || gameStatus}
                    </div>
                    <div className="game-board" style={{borderColor: this.setBorderColor()}}>
                        <Board
                            boardState={boardState}
                            currentPlayer={currentPlayer}
                            activePiece={activePiece}
                            moves={moves}
                            columns={columns}
                            onClick={(coordinates) => this.handleClick(coordinates)}
                        />
                    </div>
                </div>

            </div>

        );
    }
}

