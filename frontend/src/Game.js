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
            turn: ''
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
            const data= JSON.parse(e.data);
            const game = data.gameState;
            let latestHistory = game.history;
            let history = this.state.history;
            console.info("Got new history");
            console.log(latestHistory);
            console.info("Current history");
            console.log(history);
            // let currentState  = Object.assign({}, state.history[state.stepNumber]);
            this.setState({
                'activePiece': game.activePiece,
                'moves': game.moves,
                'jumpKills': game.jumpKills,
                'hasJumped': game.hasJumped,
                'stepNumber': game.stepNumber,
                'winner': game.winner,
                'turn': data.turn
            })
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
        //keep last column to be named "i", in case of "h", bootstrap will expand last column in weird way
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
            return;
        }

        if (this.state.winner !== null) {
            return;
        }

        const currentState = this.getCurrentState();
        const boardState = currentState.boardState;
        const clickedSquare = boardState[coordinates];

        // Clicked on a piece
        if (clickedSquare !== null) {

            // Can't select opponents pieces
            if (clickedSquare.player !== returnPlayerName(currentState.currentPlayer)) {
                return;
            }

            // Unset active piece if it's clicked
            if (this.state.activePiece === coordinates && this.state.hasJumped === null) {
                this.setState({
                    activePiece: null,
                    moves: [],
                    jumpKills: null,
                });
                return;
            }

            // Can't choose a new piece if player has already jumped.
            if (this.state.hasJumped !== null && boardState[coordinates] !== null) {
                return;
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

        //PASS DATA TO ANOTHER PLAYER
        this.setState({turn: false});
        const latestHistory = this.state.history[this.state.history.length-1]
        console.log(latestHistory);
        this.gameSocket.send(JSON.stringify({
            'userSender': this.props.user,
            'user': this.props.opponent,
            'gameState': {
                'history': latestHistory,
                'activePiece': this.state.activePiece,
                'moves': this.state.moves,
                'jumpKills': this.state.jumpKills,
                'hasJumped': this.state.hasJumped,
                'stepNumber': this.state.stepNumber,
                'winner': this.state.winner,

            },
            'turn': !this.state.turn
        }));
        //    To-Do: send data through websockets
        //    Send message to make another player turn equal true
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
        });

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

    render() {
        const columns = this.columns;
        const stateHistory = this.state.history;
        const activePiece = this.state.activePiece;
        const currentState = stateHistory[this.state.stepNumber];
        const boardState = currentState.boardState;
        const currentPlayer = currentState.currentPlayer;
        const moves = this.state.moves;


        let gameStatus;

        const isWinner = !!(this.state.winner)
        if (isWinner) {
            const button = document.getElementById("playAgainButton");
            let buttonClass = button.className;
            const word = "disabled"
            buttonClass = buttonClass.slice(0, buttonClass.length - word.length);
            button.className = buttonClass
        }

        switch (this.state.winner) {
            case 'player1pieces':
                gameStatus = 'Player One Wins!';
                break;
            case 'player2pieces':
                gameStatus = 'Player Two Wins!';
                break;
            case 'player1moves':
                gameStatus = 'No moves left - Player One Wins!';
                break;
            case 'player2moves':
                gameStatus = 'No moves left - Player Two Wins!';
                break;
            default:
                gameStatus = currentState.currentPlayer === true ? 'Player One' : 'Player Two';
                break;
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
                    <div className="game-status">
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

