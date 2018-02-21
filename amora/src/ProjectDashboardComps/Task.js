import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import tempPic from "../images/temp.jpg"
import "./Task.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';
import UserIcon from "./UserIcon.js"
import AddUserButton from "./AddUserButton.js"
import Comment from "./TaskComment.js"


class Task extends Component {

    constructor() {
      super();

      this.state = {
           open: false,
           visible: 'hidden',
           description: 'I am a very descriptive description!',
           taskID: "",
           archived: false,
       }
    }

    switch = () => {
        if (this.state.open){
            this.setState({ open: false, visible: 'hidden' });
        } else {
            this.setState({ open: true, visible: 'visible' });
        }

    };

    css = () => {
        if (this.state.open) {
            /* CSS for larger task stuff */
            return ({
                height: 'auto',
                backgroundColor: 'white',
                 boxShadow: '0px 0px 3px lightgrey',
                 marginTop: '5px',
                 marginBottom: '5px'
            })
        } else {
            return ({height: '40px'})

        }

    }

    testFunction = () => {
        if(!this.props.archived){
            rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}`, function(err){
                if(!err){
                    console.log("fiddlesticks")
                }
              });
        } else {
            rebase.remove(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}`, function(err){
                if(!err){
                    console.log("fiddlesticks")
                }
              });
        }



    }

    checkIsVisible = () => {
        if (this.props.archived){
            return ({
                visibility: 'visible'
            })
        } else {
            return ({
                visibility: 'hidden'
            })
        }
    }

    //Ian: Archive the task if it's archived. Unarchive it if it's not.
    toggleArchived = () => {
        if(this.props.archived){
            //Unarchive
            const projID = this.props.projectID;
            const taskID = this.props.taskKey;
            rebase.fetch(`projects/${projID}/archivedTaskList/${taskID}`, {
                context: this,
                then(taskData){
                    //console.log(taskID);
                    rebase.post(`projects/${projID}/taskList/${taskID}`, {
                        data: taskData,
                        then(err){
                            //Thanks Alex
                            rebase.remove(`projects/${projID}/archivedTaskList/${taskID}`, function(err){
                                if(!err){
                                    console.log("fickstiddles")
                                }
                              });
                        }
                    })

                }
            })
        } else {
            //Archive
            const projID = this.props.projectID;
            const taskID = this.props.taskKey;
            rebase.fetch(`projects/${projID}/taskList/${taskID}`, {
                context: this,
                then(taskData){
                    //console.log(taskID);
                    rebase.post(`projects/${projID}/archivedTaskList/${taskID}`, {
                        data: taskData,
                        then(err){
                            //Thanks Alex
                            rebase.remove(`projects/${projID}/taskList/${taskID}`, function(err){
                                if(!err){
                                    console.log("stickfiddles")
                                }
                              });
                        }
                    })

                }
            })
        }
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

/* style={{visibility: this.state.visible}} */



    render = () => {
        const { open } = this.state;


        return (
            <div onClick={this.switch} >
                <div id="task" style={this.css()}>
                    <div id="taskStats">
                        <div id="taskCheckAndTitle">
                            <svg height="40" width="40">

                                 <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox" onClick={this.toggleArchived}/>
                                 <line x1="5" x2="13" y1="17" y2="23" style={this.checkIsVisible()} className="checkBox" />
                                 <line x1="13" x2="27" y1="23" y2="7" style={this.checkIsVisible()} className="checkBox" />
                            </svg>
                            <h4 id="taskTitle">{this.props.task.taskName}</h4>
                        </div>
                        <h5 style={{right: '12px'}}><b>!!!</b> | 7h | 3d</h5>
                    </div>
                    <div style={{visibility: this.state.visible}} id="taskInfo">
                        <p id="taskDescription">{this.props.task.taskDescription}</p>
                        <div id="taskUsers">
                            {/*<UserIcon getAppState={this.props.getAppState} />*/}
                            {/*<UserIcon getAppState={this.props.getAppState} />*/}
                            <AddUserButton />

                            <div id="Task">
                            <i className="material-icons createProjectButton" onClick={this.testFunction}>backspace</i>

            </div>

                        </div>
                        <div id="taskComments">
                            <Comment />
                            <Comment />
                        </div>
                    </div>
                </div>

            </div>
        )

    }

}

export default Task;
