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
        rebase.remove(`users/${this.props.getAppState().user.uid}/notifications/${this.props.notificationKey}`)
    }

    declineInvite = () => {
        rebase.remove(`users/${this.props.getAppState().user.uid}/notifications/${this.props.notificationKey}`)
    }

    render = () => {
        return (
            <div>
                <p onClick={() => console.log(this.props.key)}>You've been invited to join: {this.props.notification.projectName}</p>
                <button onClick={this.acceptInvite}>Accept</button>
                <button onClick={this.declineInvite}>Decline</button>
                <p>(Zach make this look nice :^)</p>
            </div>
        )
    }
}

export default Notification;