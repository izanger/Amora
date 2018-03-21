import React, { Component } from 'react'
import rebase from "../rebase.js"
import UserIcon from "./UserIcon.js"
import "./TaskComment.css"
import funnytemp from "../images/temp.jpg"



class TaskComment extends Component {

    constructor() {
        super()
        this.state = {
            uid: '',
            commentValue: ''
        }
    }

    deleteComment = () => {
        if(this.props.archived){
            rebase.remove(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments/${this.props.commentID}`)

        }else {
            rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments/${this.props.commentID}`)

        }
    }

    render = () => {

        // let color = "#3CB4CB"; 
        if(this.props.showDelete){
            return (
                <div id="taskCommentContainer">
                    <svg height="2px" width="100%" className="taskCommentDivider">
                        <line x1="12" y1="0" x2="98.5%" y2="0" style={{stroke:'#C6C6C6',strokeWidth:'3'}} />
                    </svg>
                    <div id="taskCommentContents">
                        {/*Temporarily commented out. Uncomment when actual image of person is displayed 
                        <div id="taskUserIcon" > src={funnytemp} <UserIcon getAppState={this.props.getAppState} /></div>*/}
                        
                        {/*Temporary image placeholder*/}
                        {/* <div id="userIconContainer" >
                            <img src={this.props.image} className="projectPicture"/>                     
                            <div id="projectIndicator" ></div>
                        </div>           */}
                        {console.log(this.props)}
                        <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                        getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                        key={this.props.userKey} user={this.props.project.userList[this.props.userID]} userID={this.props.userID} project={this.props.project} />  
    
                        <div id="taskNameAndComment">
                            <p id="taskCommentName">{this.props.username}</p>
                            <p id="taskCommentText">{this.props.commentValue}</p>
                        </div>
                    </div>
                    <button onClick={this.deleteComment}>Delete Comment</button>
    
                </div>
            )
        }else {
            return (
                <div id="taskCommentContainer">
                    <svg height="2px" width="100%" className="taskCommentDivider">
                        <line x1="12" y1="0" x2="98.5%" y2="0" style={{stroke:'#C6C6C6',strokeWidth:'3'}} />
                    </svg>
                    <div id="taskCommentContents">
                        {/*Temporarily commented out. Uncomment when actual image of person is displayed 
                        <div id="taskUserIcon" > src={funnytemp} <UserIcon getAppState={this.props.getAppState} /></div>*/}
                        
                        {/*Temporary image placeholder*/}
                        {/* <div id="userIconContainer" >
                            <img src={this.props.image} className="projectPicture"/>                     
                            <div id="projectIndicator" ></div>
                        </div>     */}
                        <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                        getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                        key={this.props.userKey} user={this.props.project.userList[this.props.userKey]} userID={this.props.userKey} project={this.props.project} />      
    
                        <div id="taskNameAndComment">
                            <p id="taskCommentName">{this.props.username}</p>
                            <p id="taskCommentText">{this.props.commentValue}</p>
                        </div>
                        
                    </div>
    
                </div>
            )
        }
        
    }

}

export default TaskComment;
