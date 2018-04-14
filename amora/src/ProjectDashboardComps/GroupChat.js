import React, { Component } from 'react'
import rebase from "../rebase.js"
import ChatMessage from './ChatMessage.js';

class GroupChat extends Component {

    constructor() {
        super()
        this.state = {
            project: { },
            projectSynced: false,
            bodyValue: ""
        }
    }

    componentDidMount = () => {
        const newState = { ...this.state }
        rebase.fetch(`projects/${this.props.match.params.id}`, {
            context: this,
            then: (data) => {
                newState.project = data
            }
        }).then(() => {
            this.bindingref = rebase.syncState(`projects/${this.props.match.params.id}`, {
                context: this,
                state: 'project',
                then: () => {
                    newState.projectSynced = true
                    this.setState(newState)
                }
            })
        })
        console.log(this.state)
    }

    makeid = () => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (let i = 0; i < 10; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
    createChat = () => {
        const message = {
            body: this.state.bodyValue,
            time: "now",
            uid: this.props.getAppState().user.uid,
            url: this.props.getAppState().user.photoURL,
            key: 0
        }
        rebase.update(`projects/${this.props.match.params.id}/chat/${message.key}`, {
            data: message
        })
        rebase.post(`projects/${this.props.match.params.id}/numMessages`, {
            data: 1
        })
    }

    postMessage = () => {
        if (!this.state.project.chat) {
            this.createChat()
            return
        }
        const message = {
            body: this.state.bodyValue,
            time: "now",
            uid: this.props.getAppState().user.uid,
            url: this.props.getAppState().user.photoURL,
            key: this.state.project.numMessages
        }

        const newState = { ...this.state }
        newState.project.chat[message.key] = message
        newState.project.numMessages += 1
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
        let keys = []
        if (this.state.project.chat) {
            keys = Object.keys(this.state.project.chat)
        }
        return (
            <div>
                <input value={this.state.bodyValue} onChange={this.changeBody}></input>
                <button onClick={this.postMessage}>Send</button>
                {keys.map((key) => {
                    return <ChatMessage body={this.state.project.chat[key].body}/>
                })}
            </div>
        )
    }

}

export default GroupChat
