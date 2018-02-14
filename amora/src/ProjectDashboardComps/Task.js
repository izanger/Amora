import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import tempPic from "../images/temp.jpg"
import "./Task.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';


class Task extends Component {

    constructor() {
      super();

      this.state = { open: false, visible: 'hidden' }
    }

    switch = () => {
        if (this.state.open){
            console.log(this.state.visible)
            this.setState({ open: false, visible: 'hidden' });
        } else {
            console.log(this.state.visible)
            this.setState({ open: true, visible: 'visible' });
        }

    };

    css = () => {
        if (this.state.open){
            /* CSS for larger task stuff */
            return ({
                height: '100px',
                backgroundColor: 'white'
            })
        } else {
            return ({height: '40px'})

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
                        <h4 id="taskTitle">Task Title</h4>
                        <h5 style={{right: '12px;'}}><b>!!!</b> | 7h | 3d</h5>
                    </div>
                    <div style={{visibility: this.state.visible}} id="taskInfo">
                        <p>Hey u fook</p>
                    </div>
                </div>

            </div>
        )

    }

}

export default Task;
