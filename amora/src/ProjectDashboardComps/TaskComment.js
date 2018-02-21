import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import UserIcon from "./UserIcon.js"
import "./TaskComment.css"
import funnytemp from "../images/temp.jpg"



class TaskComment extends Component {

    constructor() {
        super()
        this.state = {
            name: 'User\'s Name',
            comment: 'Comment and the like. This is a very nice comment. Lots to say. I just won\' shutup, now will I?'
        }
    }

    render = () => {
        let color = "#3CB4CB";
        return (
            <div id="taskCommentContainer">
                <svg height="2px" width="100%" className="taskCommentDivider">
                    <line x1="12" y1="0" x2="98.5%" y2="0" style={{stroke:'#C6C6C6',strokeWidth:'3'}} />
                </svg>
                <div id="taskCommentContents">
                    {/*Temporarily commented out. Uncomment when actual image of person is displayed 
                    <div id="taskUserIcon" > src={funnytemp} <UserIcon getAppState={this.props.getAppState} /></div>*/}
                    
                    {/*Temporary image placeholder*/}
                    <div id="userIconContainer" >
                        <img src={funnytemp} className="projectPicture"/>                     
                        <div id="projectIndicator" style={{backgroundColor: color}}></div>
                    </div>          

                    <div id="taskNameAndComment">
                        <p id="taskCommentName">{this.state.name}</p>
                        <p id="taskCommentText">{this.state.comment}</p>
                    </div>
                </div>

            </div>
        )
    }

}

export default TaskComment;
