import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import tempPic from "../images/temp.jpg"
import "./Task.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';
import UserIcon from "./UserIcon.js"
import AddUserButton from "./AddUserButton.js"


class Task extends Component {

    constructor() {
      super();

      this.state = { open: false,
           visible: 'hidden',
           description: 'I am a very descriptive description!',
           taskID: ""
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
                height: '100px',
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
        rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}`, function(err){
            if(!err){
                console.log("shit")
            //   Router.transitionTo('dashboard');
            }
          });


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

                                 <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox"/>
                            </svg>
                            <h4 id="taskTitle">{this.props.task.taskName}</h4>
                        </div>
                        <h5 style={{right: '12px'}}><b>!!!</b> | 7h | 3d</h5>
                    </div>
                    <div style={{visibility: this.state.visible}} id="taskInfo">
                        <p id="taskDescription">{this.props.task.taskDescription}</p>
                        <div id="taskUsers">
                            <UserIcon />
                            <UserIcon />
                            <AddUserButton />

                            <div id="Task">
                            <i className="material-icons createProjectButton" onClick={this.testFunction}>backspace</i>
        
            </div>

                        </div>
                        <svg>
                        <line x1="12" y1="0" x2="98.5%" y2="0" style={{stroke:'#C6C6C6',strokeWidth:'3'}} />
                        </svg>
                    </div>
                </div>

            </div>
        )

    }

}

export default Task;
