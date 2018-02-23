import React, { Component } from 'react'

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
        // let color = "#3CB4CB";
        let userKeys
        if (this.props.users) {
            userKeys = Object.keys(this.props.users)
        }
        //console.log(this.props)
        return (
            <div>
                <div id="ProjectCollaboratorsBarContainter">
                    {userKeys && userKeys.map((key) => {
                        return (<UserIcon color={this.props.color} getAppState={this.props.getAppState} key={key} user={this.props.users[key]} userID={key} />)
                    })}
                </div>
            </div>
        )
    }

}

export default ProjectCollaboratorsBar;
