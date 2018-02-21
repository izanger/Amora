import React, { Component } from "react"
import rebase from "./rebase";

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
        console.log(this.props.notification)
        return (
            <div>
                <p>You've been invited to join: {this.props.notification.projectName}</p>
                <button onClick={this.acceptInvite}>Accept</button>
                <button onClick={this.declineInvite}>Decline</button>
                <p>(Zach make this look nice :^)</p>
            </div>
        )
    }
}

export default Notification;