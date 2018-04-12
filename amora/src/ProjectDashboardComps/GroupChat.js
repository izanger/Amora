import React, { Component } from 'react'


class GroupChat extends Component {

    constructor() {
        super()
        this.state = {
            messages: [],
            bodyValue: ""
        }
    }

    postMessage = () => {
        const message = {
            body: this.state.bodyValue,
            time: "now",
            uid: this.props.getAppState().user.uid,
            url: this.props.getAppState().user.photoURL
        }
        const newState = { ...this.state }
        newState.messages.push(message)
        this.setState(newState)
    }

    renderMessage = (message) => {
        console.log(message)
        return (
            <p>
                {message.body}
            </p>
        )
    }

    changeBody = (event) => {
        this.setState({bodyValue: event.target.value})
    }

    render = () => {
        // let color = "#3CB4CB";
        return (
            <div>
                <input value={this.state.bodyValue} onChange={this.changeBody}></input>
                <button onClick={this.postMessage}>Send</button>
                {this.state.messages.map((message) => {
                    console.log("Here")
                    return this.renderMessage(message)
                })}
            </div>
        )
    }

}

export default GroupChat
