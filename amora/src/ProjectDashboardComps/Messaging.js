import React, { Component } from 'react'
import rebase from "../rebase.js"
import ChatMessage from './ChatMessage.js';
import MessagingMessage from "./MessagingMessage"
import leftArrow from "../images/Icons/LeftArrow.svg"

class Messaging extends Component {

    constructor() {
        super()
        this.state = {
            myChat: { },
            project: { },
            myChatSynced: false,
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

    componentWillReceiveProps = (nextProps) => {
        //console.log(nextProps)
        const nextId = nextProps.match.params.id
        if (nextId !== undefined) {
            this.setState({chatOpen: true})
        } else {
            this.setState({chatOpen: false})
        }
        // this.setState({myChatSynced: false})
        // if (this.chatbindingref) {
        //     rebase.removeBinding(this.chatbindingref)
        // }
        // const newState = { ...this.state }
        // rebase.fetch(`users/${nextId}`, {
        //     context: this,
        //     then: (data) => {
        //         newState.project = data
        //         const userKeys = Object.keys(data.userList)
        //         console.log(userKeys)
        //         for (let i = 0; i < userKeys.length; i++) {
        //             if (userKeys[i] !== this.props.getAppState().user.uid) {
        //                 const newAppState = { ...this.props.getAppState() }
        //                 newAppState.user.contacts[userKeys[i]] = data.userList[userKeys[i]]
        //                 this.props.setAppState(newAppState)
        //             }
        //         }
        //     }
        // }).then(() => {
        //     this.bindingref = rebase.syncState(`projects/${nextId}`, {
        //         context: this,
        //         state: 'myChat',
        //         then: () => {
        //             newState.myChatSynced = true
        //             this.setState(newState)
        //         }
        //     })
        // })
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
        const overall = {
            numMessages: 1,
            userKey: this.props.match.params.id,
            messages: {
                [message.key]: message
            }
        }
        rebase.update(`users/${this.props.getAppState().user.uid}/messages/${this.props.match.params.id}`, {
            data: overall
        })
        rebase.update(`users/${this.props.match.params.id}/messages/${this.props.getAppState().user.uid}`, {
            data: overall
        })
    }

    postMessage = () => {
        if (this.props.getAppState().user.messages[this.props.match.params.id] === undefined) {
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
            key: this.props.getAppState().user.messages[this.props.match.params.id].numMessages
        }
        const newState = { ...this.props.getAppState() }
        newState.user.messages[this.props.match.params.id].messages[newState.user.messages[this.props.match.params.id].numMessages] = message
        newState.user.messages[this.props.match.params.id].numMessages += 1
        this.props.setAppState(newState)
        rebase.post(`users/${this.props.match.params.id}/messages/${this.props.getAppState().user.uid}/numMessages`, {
            data: newState.user.messages[this.props.match.params.id].numMessages
        })
        rebase.post(`users/${this.props.match.params.id}/messages/${this.props.getAppState().user.uid}/messages/${message.key}`, {
            data: message
        })
    }

    changeBody = (event) => {
        this.setState({bodyValue: event.target.value})
    }

    render = () => {

        let chat
        if (this.state.chatOpen && this.props.match.params.id !== undefined) {
            const newState = { ...this.props.getAppState() }
            let keys = []
            if (newState.user.messages[this.props.match.params.id] !== undefined) {
                keys = Object.keys(newState.user.messages[this.props.match.params.id].messages)
            }
            chat = (
                <div style={{marginRight: '14px', marginLeft: '14px'}}>

                    <div style={{position: 'absolute', bottom: '14px', width: '97%'}}>
                        <input type="text" name="Comment" id="CommentField chatMessageField"  onChange={this.changeBody} value={this.state.bodyValue} placeholder="New Chat" className="commentInput" style={{width: '100%'}}/>
                        <svg width="15px" height="18px" style={{position: 'absolute', marginTop: '-22px', right: '7px', cursor: 'pointer'}} onClick={this.postMessage}>
                            <title>Combined Shape</title>
                            <desc>Created with Sketch.</desc>
                            <defs></defs>
                                <g id="Reiterate-on-Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <g id="Desktop" transform="translate(-772.000000, -493.000000)" fill="#B8B8B8">
                                        <path d="M783.7,509.5 L788.5,509.5 L779.5,494.5 L770.5,509.5 L775.3,509.5 L779.5,502.5 L783.7,509.5 Z" id="Combined-Shape" transform="translate(779.500000, 502.000000) rotate(90.000000) translate(-779.500000, -502.000000) "></path>
                                    </g>
                                </g>
                        </svg>
                    </div>

                    <div style={{overflowY: 'scroll', marginTop: '7px'}}>
                        {keys.map((key) => {
                            return <MessagingMessage body={newState.user.messages[this.props.match.params.id].messages[key].body}
                            getAppState={this.props.getAppState}
                            url={newState.user.messages[this.props.match.params.id].messages[key].url} uid={newState.user.messages[this.props.match.params.id].messages[key].uid}
                            time={newState.user.messages[this.props.match.params.id].messages[key].time} project={this.state.project} name={newState.user.messages[this.props.match.params.id].messages[key].name}/>
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


                </div>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: '-35px'}}>
                    {contactKeys.map((userId) => {
                        if (userId !== this.props.getAppState().user.uid) {
                            return <div onClick={() => {
                                this.props.goToUrl(`/messaging/${userId}`)
                            }} id="userIconContainer" style={{marginTop: '50px'}}><img alt={"User"} src={this.props.getAppState().user.contacts[userId]} className="projectPicture" /></div>
                        }
                    })}
                </div>

                {chat}
            </div>
        )
    }

}

export default Messaging
