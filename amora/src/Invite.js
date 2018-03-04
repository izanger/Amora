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
        rebase.post(`users/${this.props.getAppState().user.uid}/projects/${this.props.notificationKey}`, {
            data: this.props.notification
        })
        console.log(this.props.notification)
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
                <p className="inviteText">This one is an invite</p>
                <p className="inviteText">You've been invited to join: {this.props.notification.projectName}</p>
                <button className="inviteButton" onClick={this.acceptInvite}>Accept</button>
                <button className="inviteButton" onClick={this.declineInvite}>Decline</button>
            </div>
        )
    }
}

export default Notification;