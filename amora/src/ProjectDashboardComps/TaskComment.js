import React, { Component } from 'react'
import rebase from "../rebase.js"
import UserIcon from "./UserIcon.js"
import CommentUserIcon from "./CommentUserIcon.js"
import "./TaskComment.css"
import funnytemp from "../images/temp.jpg"
import ContentEditable from 'react-contenteditable'


class TaskComment extends Component {

    constructor() {
        super()
        this.state = {
            uid: '',
            commentValue: '',
        }
    }

    deleteComment = () => {
        if(this.props.archived){
            rebase.remove(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments/${this.props.commentID}`)

        }else {
            rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments/${this.props.commentID}`)
        }
    }

    changeComment = (event) => {
        if (event.target.value.length !== 0) {
            const newState = this.props.getProjectDashboardState()

            //var date = new Date(this.props.timestamp)
            //let formattedDate =  date.toLocaleTimeString() + " on " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
            var today = new Date();
            let e = "Edited at";

            if(this.props.archived){
                newState.project.archivedTaskList[this.props.taskKey].taskComments[this.props.commentID].text = event.target.value
                newState.project.archivedTaskList[this.props.taskKey].taskComments[this.props.commentID].timestamp = today.getTime()
                newState.project.archivedTaskList[this.props.taskKey].taskComments[this.props.commentID].edited = e
            }else {
                newState.project.taskList[this.props.taskKey].taskComments[this.props.commentID].text = event.target.value
                newState.project.taskList[this.props.taskKey].taskComments[this.props.commentID].timestamp = today.getTime()
                newState.project.taskList[this.props.taskKey].taskComments[this.props.commentID].edited = e
            }
            this.props.setProjectDashboardState(newState)
        }
    }

    render = () => {
        var date = new Date(this.props.timestamp)
        let formattedDate =  date.toLocaleTimeString() + " on " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
        let isEdited = this.props.edited
        // let color = "#3CB4CB";
        if(this.props.showDelete){
            return (
                <div id="taskCommentContainer">
                    <svg height="2px" width="101%" className="taskCommentDivider">
                        <line x1="12" y1="0" x2="100%" y2="0" style={{stroke:'#C6C6C6',strokeWidth:'3'}} />
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
                        <CommentUserIcon color={this.props.getProjectDashboardState().project.projectColor}
                        getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                        key={this.props.userKey} user={this.props.project.userList[this.props.uid]} userID={this.props.userID} project={this.props.project} />

                        <div id="taskNameAndComment">
                            <div style={{display: 'flex', 'justify-content': 'space-between', 'flex-direction': 'row'}}>
                                <p id="taskCommentName">{this.props.username}</p>
                                <p id="taskCommentText" style={{marginBottom: '0px'}}>{isEdited} {formattedDate}</p>
                            </div>

                            <p id="taskCommentText"><ContentEditable disabled={false} onChange={this.changeComment} html={this.props.commentValue}/></p>
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
                        <CommentUserIcon color={this.props.getProjectDashboardState().project.projectColor}
                        getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                        key={this.props.userKey} user={this.props.project.userList[this.props.uid]} userID={this.props.userKey} project={this.props.project} />

                        
                        <div id="taskNameAndComment">
                            <div style={{display: 'flex', 'justify-content': 'space-between', 'flex-direction': 'row'}}>
                                <p id="taskCommentName">{this.props.username}</p>
                                <p id="taskCommentText" style={{marginBottom: '0px'}}>{isEdited} {formattedDate}</p>
                            </div>

                            <p id="taskCommentText"><ContentEditable disabled={false} onChange={this.changeComment} html={this.props.commentValue}/></p>
                        </div>

                    </div>

                </div>
            )
        }

    }

}

export default TaskComment;
