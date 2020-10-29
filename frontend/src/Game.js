import React from 'react';
import {returnPlayerName} from './utils.js';
import {ReactCheckers} from './ReactCheckers.js';
import Board from './Board.js';
// import { Router } from 'react-router-dom'
// import {Opponent} from './Opponent.js';


export class Game extends React.Component {

    constructor(props) {
        super(props);

        this.columns = this.setColumns();

        this.ReactCheckers = new ReactCheckers(this.columns);
        // this.Opponent = new Opponent(this.columns);

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
            gameStatus: ((this.props.isFirstPlayer)? "Click on board" : "Wait for opponent move")
        }
    }

    componentDidMount() {
        this.assignTurn();

        //Game Socket  ->>>>>
        // const gameName = (this.state.turn) ? `${this.props.opponent}+${this.props.user}` : `${this.props.user}+${this.props.opponent}`;
        const gameName = this.props.user
        console.log("game name:", gameName)
        this.gameSocket = new WebSocket(
            'ws://'
            + window.location.host
            + '/ws/game/'
            + gameName
            + '/'
        );

        this.gameSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const game = data.game_state;
            this.setState({gameStatus: this.adjustGameStatus()})
            console.log(data);
            console.log(game);
            console.log(game.activePiece);
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
            this.adjustGameStatus(data.history)
        }

        this.gameSocket.onclose = function (e) {
            console.error('Communication socket closed unexpectedly');
        };
        //<<<<- Game Socket
    }

    handleGiveUpButton = () => {
        // console.log("Message: Player has given up.")
    }

    assignTurn = () => {
        console.log("this.props.isFirstPlayer: ", this.props.isFirstPlayer)
        if (this.props.isFirstPlayer === true) {
            this.state.turn = true
        } else {
            this.state.turn = false
        }
    }

    playAgainButton = () => {
        // console.log("Message: Player would like to play again.")
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

        if (this.state.turn === false) {
            return console.log("Turn raised");
        }

        if (this.state.winner !== null) {
            return console.log("Winner raised");
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

        console.log("current history", this.state.history);
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

    adjustGameStatus = (history) => {
        try {
            const whoPlays = history.currentPlayer;
            // console.group();
            // console.log("who plays", this.state.history);
            console.log("who plays: ", whoPlays);
            console.log("isFirstPlayer", this.props.isFirstPlayer);
            // console.groupEnd();
            if (this.props.isFirstPlayer) {
                if (!!whoPlays) {
                    console.log("Setstate 'your move'")
                    this.setState({gameStatus: "Your move"});
                } else {
                    console.log("Setstate 'opponents move'")
                    this.setState({gameStatus: `${this.props.opponent}'s move`});
                }
            } else {
                if (!!whoPlays) {
                    console.log("Setstate 'opponents move'")
                    this.setState({gameStatus: `${this.props.opponent}'s move`});
                } else {
                    console.log("Setstate 'your move'")
                    this.setState({gameStatus: "Your move"});
                }
            }

            // if ((whoPlays && this.props.isFirstPlayer) || (!whoPlays && !this.props.isFirstPlayer)) {
            //     this.setState({gameStatus: "Your move"});
            // } else if ((whoPlays && !this.props.isFirstPlayer) || (!whoPlays && this.props.isFirstPlayer)) {
            //     this.setState({gameStatus: `${this.props.opponent}'s move`});
            // } else {
            //     console.warning("adjustGameStatus warning")
            // }
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

        const isWinner = !!(this.state.winner)
        if (isWinner) {
            console.log("is winner");
            const button = document.getElementById("playAgainButton");
            let buttonClass = button.className;
            const word = "disabled"
            buttonClass = buttonClass.slice(0, buttonClass.length - word.length);
            button.className = buttonClass


        }

        switch (this.state.winner) {
            case 'player1pieces':
                this.setState({gameStatus: 'Player One Wins!'})
                break;
            case 'player2pieces':
                this.setState({gameStatus: 'Player Two Wins!'})
                break;
            case 'player1moves':
                this.setState({gameStatus: 'No moves left - Player One Wins!'})
                break;
            case 'player2moves':
                this.setState({gameStatus: 'No moves left - Player Two Wins!'})
                break;
            // default:
            //     this.setState({gameStatus: "Winner unknown"})
            //     break;
        }


        return (

            <div className="game-page website-styles center-main-container ">

                <div className="flex-wrapper border-padding btn-group">
                    <div style={{flex: 3}}>
                        <button className="btn btn-sm btn-success disabled" onClick={this.handleGiveUpButton}>Give up
                        </button>
                    </div>
                    <div style={{flex: 3}}>
                        <button className="btn btn-sm btn-success" onClick={() => this.props.goToLobby()}>Exit to
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
                <div className="reactCheckers">
                    <div className="game-status" id="game-status">
                        {gameStatus}
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

