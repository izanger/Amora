import React, { Component } from "react"
import rebase from "./rebase";

import "./Invite.css"

class Notification extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    acceptInvite = () => {
        const key = this.props.notification.key
        const userProject = {
            projectName: this.props.notification.projectName,
            projectPhotoURL: this.props.notification.projectPhotoURL,
            key: key,
            isPersonalDashboardProject: "false",
            taskAlertTime: this.props.notification.taskAlertTime,
            filter: "Suggested",
            projectColor: this.props.notification.projectColor
        }
        rebase.post(`users/${this.props.getAppState().user.uid}/projects/${this.props.notificationKey}`, {
            data: userProject
        })
        rebase.post(`projects/${this.props.notification.key}/userList/${this.props.getAppState().user.uid}`, {
            data: this.props.getAppState().user.photoURL
        })
        rebase.remove(`users/${this.props.getAppState().user.uid}/notifications/${this.props.notificationKey}`)
    }

    declineInvite = () => {
        rebase.remove(`users/${this.props.getAppState().user.uid}/notifications/${this.props.notificationKey}`)
    }

    render = () => {
        return (
            <div className="inviteContainer">
                <p className="text_header">You've been invited to join: {this.props.notification.projectName}</p>
                <p>Description: {this.props.notification.projectDescription}</p>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <button className="addCommentButton" style={{width: '100px', marginRight: '7px'}} onClick={this.acceptInvite}>Accept</button>
                    <button className="addCommentButton" style={{width: '100px'}} onClick={this.declineInvite}>Decline</button>
                </div>

            </div>
        )
    }
}

export default Notification;
