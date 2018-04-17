import React, { Component } from 'react'

import UserIcon from "./UserIcon.js"
import "./ProjectCollaboratorsBar.css"
import Modal from 'react-responsive-modal/lib/css';
import logIcon from "../images/Icons/log.png"
import rebase from "../rebase.js"
import Announcements from "./Announcements.js"
import "./Announcements.css"



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

        let annKeys
        if (this.props.project.announcements){
            annKeys = Object.keys(this.props.project.announcements)
        }

        return (
            <div>
                <div id="ProjectCollaboratorsBarContainter">
                    {userKeys && userKeys.map((key) => {
                        return (<UserIcon hasBorder={true} color={this.props.color} getAppState={this.props.getAppState}
                        key={key} user={this.props.users[key]} userID={key} projectID={this.props.projectID} project={this.props.project}/>)
                    })}
                </div>
                {annKeys && annKeys.map((key) => {
                        return (<Announcements key={key} data={this.props.project.announcements[key]}/>)
                    })}
            </div>
        )
    }

}

export default ProjectCollaboratorsBar;
