import React, { Component } from 'react'
import rebase from "../rebase.js"
import ContentEditable from 'react-contenteditable'

import "./Task.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
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
           color: '#3CB4CB'
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
        var response = window.confirm("Are you sure you want to delete this task?")
        if (response == true){
            
        


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
    }

    checkIsVisible = () => {
        if (this.props.archived){
            return ({
                visibility: 'visible',
                stroke: 'white'
            })
        } else {
            return ({
                visibility: 'hidden'
            })
        }
    }
      
        

    checkRectIsArchived = () => {
        if (this.props.archived){
            return ({
                visibility: 'visible',
                borderWidth: '0px',
                fill: '#3CB4CB'
            })
        } else {
            return ({
                fill: 'transparent',

            })
        }
    }

    //Ian: Archive the task if it's archived. Unarchive it if it's not.
    toggleArchived = () => {
        if (this.props.archived){
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
            // Archive
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


    changeTaskName = (event) => {
        if (event.target.value.length !== 0) {
            const newState = this.props.getProjectDashboardState()
            newState.project.taskList[this.props.taskKey].taskName = event.target.value
            this.props.setProjectDashboardState(newState)
        }
    }

    changeTaskDescription = (event) => {
        if (event.target.value !== "") {
            const newState = this.props.getProjectDashboardState()
            newState.project.taskList[this.props.taskKey].taskDescription = event.target.value
            this.props.setProjectDashboardState(newState)
        }
    }



    render = () => {
        return (
            <div onClick={() => {
                if (!this.state.open) {
                    this.switch()
                }
            }} >
                <div id="task" style={this.css()}>
                    <div id="taskStats">
                        <div id="taskCheckAndTitle">
                            <svg height="40" width="40">

                                 <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox" style={this.checkRectIsArchived()} onClick={this.toggleArchived}/>
                                 <line x1="5" x2="10" y1="19" y2="25" style={this.checkIsVisible()} className="checkBox" />
                                 <line x1="10" x2="17" y1="25" y2="13" style={this.checkIsVisible()} className="checkBox" />
                            </svg>
                            <h4 id="taskTitle"><ContentEditable disabled={false} onChange={this.changeTaskName} html={this.props.task.taskName}/></h4>
                        </div>
                        <h5 style={{right: '12px'}}><b>!!!</b> | 7h | 3d</h5>
                    </div>
                    <div style={{visibility: this.state.visible}} id="taskInfo">
                        <p id="taskDescription"><ContentEditable disabled={false} onChange={this.changeTaskDescription}
                        html={this.props.task.taskDescription} /> </p>
                        <div id="taskUsers">
                            <UserIcon />
                            <UserIcon />
                            <AddUserButton />

                            <div id="Task">
                            <i className="material-icons createProjectButton" onClick={this.testFunction}>backspace</i>

            </div>

                        </div>
                        <div id="taskComments">
                            <Comment />
                            <Comment />
                        </div>
                        <div className="closeTaskButton" onClick={this.switch}>CLICK ME TO CLOSE THE THING</div>
                    </div>
                </div>

            </div>
        )

    }

}

export default Task;
