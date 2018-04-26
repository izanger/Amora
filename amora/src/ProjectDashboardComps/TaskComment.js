import React, { Component } from 'react'
import rebase from "../rebase.js"
import CommentUserIcon from "./CommentUserIcon.js"
import "./TaskComment.css"
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
        // console.log(this.props)
        if (this.props.uid !== this.props.userID){
                return;
        }
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
                <div id="taskCommentContainer" style={{marginTop: '13px'}}>
                    <div id="taskCommentContents">
                        {/*Temporarily commented out. Uncomment when actual image of person is displayed
                        <div id="taskUserIcon" > src={funnytemp} <UserIcon getAppState={this.props.getAppState} /></div>*/}

                        {/*Temporary image placeholder*/}
                        {/* <div id="userIconContainer" >
                            <img src={this.props.image} className="projectPicture"/>
                            <div id="projectIndicator" ></div>
                        </div>           */}
                        {/* {console.log(this.props)} */}
                        <CommentUserIcon color={this.props.getProjectDashboardState().project.projectColor}
                        getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                        key={this.props.userKey} user={this.props.project.userList[this.props.uid]} userID={this.props.userID} project={this.props.project} />

                        <div id="taskNameAndComment">
                            <div style={{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between'}}>
                                <div style={{display: 'flex', 'flex-direction': 'row'}}>
                                    <p id="taskCommentName" className="text_description">{this.props.username}</p>
                                    <p id="taskCommentText" className="text_small_light" style={{marginBottom: '0px', marginLeft:'7px'}}>    {isEdited} {formattedDate}</p>
                                </div>
                                <svg width="6px" height="16px" style={{marginRight: '0px'}} onClick={this.deleteComment} title="Delete Comment">
                                    <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="Comment" transform="translate(-663.000000, -2.000000)" stroke-width="1" stroke="#979797">
                                            <g id="Settings" transform="translate(666.000000, 10.000000) rotate(90.000000) translate(-666.000000, -10.000000) translate(659.500000, 8.500000)">
                                                <circle id="Oval-5" cx="1.5" cy="1.5" r="1.5"></circle>
                                                <circle id="Oval-5-Copy" cx="6.5" cy="1.5" r="1.5"></circle>
                                                <path d="M11.5,3 C12.3284271,3 13,2.32842712 13,1.5 C13,0.671572875 12.3284271,0 11.5,0 C10.6715729,0 10,0.671572875 10,1.5 C10,2.32842712 10.6715729,3 11.5,3 Z" id="Oval-5-Copy-2"></path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>

                            <div style={{display: 'flex', 'justify-content': 'space-between', 'flex-direction': 'row'}}>
                                    <p id="taskCommentText"><ContentEditable disabled={false} onChange={this.changeComment} html={this.props.commentValue}/></p>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }else {
            return (
                <div id="taskCommentContainer" style={{marginTop: '13px'}}>
                    <div id="taskCommentContents">
                        {/*Temporarily commented out. Uncomment when actual image of person is displayed
                        <div id="taskUserIcon" > src={funnytemp} <UserIcon getAppState={this.props.getAppState} /></div>*/}

                        {/*Temporary image placeholder*/}
                        {/* <div id="userIconContainer" >
                            <img src={this.props.image} className="projectPicture"/>
                            <div id="projectIndicator" ></div>
                        </div>           */}
                        {/* {console.log(this.props)} */}
                        <CommentUserIcon color={this.props.getProjectDashboardState().project.projectColor}
                        getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                        key={this.props.userKey} user={this.props.project.userList[this.props.uid]} userID={this.props.userID} project={this.props.project} />

                        <div id="taskNameAndComment">
                            <div style={{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between'}}>
                                <div style={{display: 'flex', 'flex-direction': 'row'}}>
                                    <p id="taskCommentName" className="text_description">{this.props.username}</p>
                                    <p id="taskCommentText" className="text_small_light" style={{marginBottom: '0px', marginLeft:'7px'}}>    {isEdited} {formattedDate}</p>
                                </div>
                                
                            </div>

                            <div style={{display: 'flex', 'justify-content': 'space-between', 'flex-direction': 'row'}}>
                                    <p id="taskCommentText"><ContentEditable disabled={false} onChange={this.changeComment} html={this.props.commentValue}/></p>
                            </div>
                        </div>
                    </div>

                </div>
            )
        }

    }

}

export default TaskComment;
