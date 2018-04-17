import React, { Component } from 'react'
import rebase from "../rebase.js"
import UserIcon from './UserIcon.js';
import CommentUserIcon from "./CommentUserIcon.js"
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
            <div id="taskCommentContainer" style={{marginTop: '13px'}}>
                <div id="taskCommentContents">
                    <CommentUserIcon color={this.props.project.projectColor}
                    getAppState={this.props.getAppState} projectID={this.props.project.key}
                    user={this.props.url} userID={this.props.uid} project={this.props.project} />

                    <div id="taskNameAndComment">
                        <div style={{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between'}}>
                            <div style={{display: 'flex', 'flex-direction': 'row'}}>
                                <p id="taskCommentName" className="text_description">{this.props.name}</p>
                                <p id="taskCommentText" className="text_small_light" style={{marginBottom: '0px', marginLeft:'7px'}}>{formattedDate}</p>
                            </div>
                        </div>
                        <div style={{display: 'flex', 'justify-content': 'space-between', 'flex-direction': 'row'}}>
                                <p id="taskCommentText">{this.props.body}</p>
                        </div>
                    </div>



                </div>




            </div>
        )
    }

}

export default ChatMessage
