import React from "react";
import DOMPurify from 'dompurify'

const roomName = 'all';
const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    const outerDiv = document.getElementById("chat-log")
    let number =  outerDiv.childElementCount
    if (number > 150) {
        let spans = outerDiv.getElementsByTagName('span'); // Get HTMLCollection of elements with the li tag name.
        outerDiv.removeChild(spans[0]);
        let lineBreaks = outerDiv.getElementsByTagName('br'); // Get HTMLCollection of elements with the li tag name.
        outerDiv.removeChild(lineBreaks[0]);
    }
    const sanitizedName = DOMPurify.sanitize(data.user);
    const sanitizedMessage = DOMPurify.sanitize(data.message);
    const name = sanitizedName + ":  ";
    const insertData = "<span class='chat-message-style'><span class='bolded'>" + name + "</span>" + sanitizedMessage + "</span><br>"
    outerDiv.innerHTML += insertData;
    outerDiv.scrollTop = outerDiv.scrollHeight;
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};


class Chatwindow extends React.Component {
    constructor(props) {
        super(props);
    }



    onResetInfoMessage = () => {
        this.setState(
            {'infoMessage': ''}
        )
    }

    clickEnter = (e) => {
        if (e.key === 'Enter') {
            this.handleChatMessage();
        }
    };


    handleChatMessage = (e) => {
        const element = document.getElementById("chat-message-input");
        const message = element.value;
        if (message.length > 1000) {
            alert("Too long message, you can use maximum of 1000 chars per message")
        } else {
            chatSocket.send(JSON.stringify({
                'message': message,
                'user': this.props.user,

            }));
            element.value = '';
        }

    }


    render() {

        return (
            <React.Fragment>
                <div id="chat-log" disabled><span className="chat-message-style" style={{fontWeight: "bold", color: "blue"}}>// Its a chat. You can find here opponent to play //</span><br/>
                </div>
                <input id="chat-message-input"
                       type="text"
                       onKeyPress={this.clickEnter}
                       placeholder="Press enter to send a message..."
                />
                <br/>

                {/*<input*/}
                {/*    className="pull-right"*/}
                {/*    id="chat-message-submit"*/}
                {/*    type="button"*/}
                {/*    value="Send"*/}
                {/*    onClick={this.handleChatMessage}*/}
                {/*    style={{flex: 1}}*/}
                {/*/>*/}
            </React.Fragment>

        )
    }
}

export default Chatwindow;
