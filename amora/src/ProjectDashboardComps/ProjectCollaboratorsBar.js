import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import tempPic from "../images/temp.jpg"
import line from "../images/Line/Line@3x.png"
import UserIcon from "./UserIcon.js"
import "./ProjectCollaboratorsBar.css"


class ProjectCollaboratorsBar extends Component {

    constructor() {
        super()
        this.state = {

        }
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */
    render = () => {
        let color = "#3CB4CB";
        let userKeys
        if (this.props.users) {
            userKeys = Object.keys(this.props.users)
        }
        return (
            <div>
                <div id="ProjectCollaboratorsBarContainter">
                    {userKeys.map((key) => {
                        return (<UserIcon getAppState={this.props.getAppState} key={key} user={this.props.users[key]} />)
                    })}
                </div>
            </div>
        )
    }

}

export default ProjectCollaboratorsBar;
