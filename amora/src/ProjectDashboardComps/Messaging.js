import React, { Component } from 'react'
import rebase from "../rebase.js"
import ChatMessage from './ChatMessage.js';
import leftArrow from "../images/Icons/LeftArrow.svg"

class Messaging extends Component {

    constructor() {
        super()
        this.state = {
            myChat: { },
            theirChat: { },
            myChatSynced: false,
            theirChatSynced: false,
            bodyValue: "",
            chatOpen: false
        }
    }

    componentDidMount = () => {
        const newState = { ...this.state }
        if (this.props.match !== undefined) {
            this.setState({chatOpen: true})
        }
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
    }

    createChat = () => {
        const today = new Date()
        const message = {
            body: this.state.bodyValue,
            time: today.getTime(),
            uid: this.props.getAppState().user.uid,
            url: this.props.getAppState().user.photoURL,
            name: this.props.getAppState().user.displayName,
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
        const today = new Date()
        const message = {
            body: this.state.bodyValue,
            time: today.getTime(),
            uid: this.props.getAppState().user.uid,
            url: this.props.getAppState().user.photoURL,
            name: this.props.getAppState().user.displayName,
            key: this.state.project.numMessages
        }
        const newState = { ...this.state }
        newState.project.chat[message.key] = message
        newState.project.numMessages += 1
        this.setState(newState)
    }

    changeBody = (event) => {
        this.setState({bodyValue: event.target.value})
    }

    render = () => {
        let keys = []

        let chat
        if (this.state.chatOpen) {
            chat = (
                <div style={{marginRight: '14px', marginLeft: '14px'}}>

                    <input type="text" name="Comment" id="CommentField chatMessageField"  onChange={this.changeBody} value={this.state.bodyValue} placeholder="New Chat" className="commentInput" style={{width: '100%'}}/>
                    <svg width="15px" height="18px" style={{position: 'absolute', marginTop: '-22px', right: '371px', cursor: 'pointer'}} onClick={this.postMessage}>
                        <title>Combined Shape</title>
                        <desc>Created with Sketch.</desc>
                        <defs></defs>
                            <g id="Reiterate-on-Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Desktop" transform="translate(-772.000000, -493.000000)" fill="#B8B8B8">
                                    <path d="M783.7,509.5 L788.5,509.5 L779.5,494.5 L770.5,509.5 L775.3,509.5 L779.5,502.5 L783.7,509.5 Z" id="Combined-Shape" transform="translate(779.500000, 502.000000) rotate(90.000000) translate(-779.500000, -502.000000) "></path>
                                </g>
                            </g>
                    </svg>
                    <div style={{overflowY: 'scroll'}}>
                        {keys.map((key) => {
                            return <ChatMessage body={this.state.project.chat[key].body}
                            getAppState={this.props.getAppState}
                            url={this.state.project.chat[key].url} uid={this.state.project.chat[key].uid}
                            time={this.state.project.chat[key].time} project={this.state.project} name={this.state.project.chat[key].name}/>
                        })}
                    </div>
                </div>
            )
        }

        const contactKeys = Object.keys(this.props.getAppState().user.contacts)

        return (
            <div id="taskDashboard">
                <div id="projectTitleContainer"  style={{backgroundColor: "#E74C3C"}}>
                    <img title="Go back" src={leftArrow} style={{height: '15px', left: '12px', top:'14px', position:'absolute'}} onClick={() => {
                        this.props.goToUrl("/dashboard")
                    }} />
                    <h1 style={{left: '35px'}} id="projectTitle" className="text_header">Messaging</h1>
                    {contactKeys.map((userId) => {
                        return <p onClick={() => {
                            console.log("Goto message")
                        }}>{userId}</p>
                    })}

                </div>
                {chat}
            </div>
        )
    }

}

export default Messaging
