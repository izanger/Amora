import React, { Component } from 'react'
import rebase from "../rebase.js"
import UserIcon from './UserIcon.js';
import { format } from 'path';

class ChatMessage extends Component {

    constructor() {
        super()
        this.state = {
        }
    }

    render = () => {
        let date = new Date(this.props.time)
        let formattedDate =  date.toLocaleTimeString() + " on " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
        return (
            <div id="taskCommentContainer">
                <svg height="2px" width="100%" className="taskCommentDivider">
                    <line x1="12" y1="0" x2="98.5%" y2="0" style={{stroke:'#C6C6C6',strokeWidth:'3'}} />
                </svg>
                <UserIcon color={this.props.project.projectColor}
                getAppState={this.props.getAppState} projectID={this.props.project.key}
                user={this.props.url} userID={this.props.uid} project={this.props.project} />
                <p>{this.props.name}</p>
                <p>{formattedDate}</p>
                <div id="taskCommentContents">
                    <div id="taskNameAndComment">
                        <div style={{display: 'flex', 'justify-content': 'space-between', 'flex-direction': 'row'}}>
                            <p id="taskCommentName">{this.props.username}</p>
                            <p id="taskCommentText" style={{marginBottom: '0px'}}></p>
                        </div>

                        <p id="taskCommentText">{this.props.body}</p>
                    </div>
                </div>
            </div>
        )
    }

}

export default ChatMessage
