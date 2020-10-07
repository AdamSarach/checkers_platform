import React from "react";
import './Game.css';

// DOM referenes
const cells = document.querySelectorAll("td");
let redsPieces = document.querySelectorAll("p");
let blacksPieces = document.querySelectorAll("span")
const redTurnText = document.querySelectorAll(".red-turn-text");
const blackTurntext = document.querySelectorAll(".black-turn-text");
const divider = document.querySelector("#divider")

var selectedPiece = {
    pieceId: -1,
    indexOfBoardPiece: -1,
    isKing: false,
    seventhSpace: false,
    ninthSpace: false,
    fourteenthSpace: false,
    eighteenthSpace: false,
    minusSeventhSpace: false,
    minusNinthSpace: false,
    minusFourteenthSpace: false,
    minusEighteenthSpace: false
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [
                null, 0, null, 1, null, 2, null, 3,
                4, null, 5, null, 6, null, 7, null,
                null, 8, null, 9, null, 10, null, 11,
                null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null,
                12, null, 13, null, 14, null, 15, null,
                null, 16, null, 17, null, 18, null, 19,
                20, null, 21, null, 22, null, 23, null
            ],
            turn: true,
            redScore: 12,
            blackScore: 12,
            playerPieces: "tbd"
        }
    }






    handleGiveUpButton = () => {
        console.log("Message: Player has given up.")
    }

    goToLobby = () => {
        console.log("Message: Player wants to exit to lobby.")
        this.props.displayForm('lobby')
    }

    playAgainButton = () => {
        console.log("Message: Player would like to play again.")
    }

    //Game function

    givePiecesEventListeners = () => {
    if (this.state.turn) {
        for (let i = 0; i < redsPieces.length; i++) {
            redsPieces[i].addEventListener("click", this.getPlayerPieces);
        }
    } else {
        for (let i = 0; i < blacksPieces.length; i++) {
            blacksPieces[i].addEventListener("click", this.getPlayerPieces);
            }
        }
    }

    getPlayerPieces = () => {
    if (this.state.turn) {
        this.setState({playerPieces: redsPieces});
    } else {
        this.setState({playerPieces: blacksPieces})
    }
    // removeCellonclick();
    // resetBorders();
    }

    render() {


        return (

            <div className="game-page website-styles center-main-container ">

                <div className="flex-wrapper border-padding btn-group">
                    <div style={{flex:3}}>
                        <button className="btn btn-sm btn-success disabled" onClick={this.handleGiveUpButton}>Give up</button>
                    </div>
                    <div style={{flex:3}}>
                        <button className="btn btn-sm btn-success" onClick={this.goToLobby}>Exit to lobby</button>
                    </div>
                    <div style={{flex:3}}>
                        <button className="btn btn-sm btn-success disabled" onClick={this.playAgainButton}>Ask to play again</button>
                    </div>
                </div>


                <main>
                    {/*<div className="red-turn-text mobile">*/}
                    {/*    Reds turn*/}
                    {/*</div>*/}

                    <table>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="0"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="1"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="2"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="3"></p></td>
                        </tr>
                        <tr>
                            <td><p className="red-piece" id="4"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="5"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="6"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="7"></p></td>
                            <td className="noPieceHere"></td>
                        </tr>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="8"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="9"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="10"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="11"></p></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                        </tr>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><span className="black-piece" id="12"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="13"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="14"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="15"></span></td>
                            <td className="noPieceHere"></td>
                        </tr>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="16"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="17"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="18"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="19"></span></td>
                        </tr>
                        <tr>
                            <td><span className="black-piece" id="20"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="21"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="22"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="23"></span></td>
                            <td className="noPieceHere"></td>
                        </tr>
                    </table>

                    <div className="desktop label-inline-block ">
                        <div className="red-turn-text">
                            Reds turn
                        </div>
                        <div id="divider">|</div>
                        <div className="black-turn-text label-inline-block ">
                            Blacks turn
                        </div>
                    </div>
                </main>
                    {/*<div className="black-turn-text mobile">*/}
                    {/*    Blacks turn*/}
                    {/*</div>*/}
            </div>
        );
    };
}

export default Game;