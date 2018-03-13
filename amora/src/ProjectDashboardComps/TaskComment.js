import React, { Component } from 'react'

import UserIcon from "./UserIcon.js"
import "./TaskComment.css"
import funnytemp from "../images/temp.jpg"



class TaskComment extends Component {

    constructor() {
        super()
        this.state = {
            name: 'User\'s Name',
            comment: 'Example Comment'
        }
    }

    render = () => {
        // let color = "#3CB4CB";
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
                        <div id="projectIndicator" ></div>
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
