import React, { Component } from "react"
import rebase from "./rebase"

class Notification extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    removeNotification = () => {
        rebase.remove(`users/${this.props.getAppState().user.uid}/notifications/${this.props.notificationKey}`)
    }

    render = () => {
        console.log(this.props.notification)
        return (
            <div>
                <p>This one is a standard notification</p>
                <p>You've been invited to join: {this.props.notification.projectName}</p>
                <p>Description: {this.props.notification.projectDescription}</p>
                <button onClick={this.removeNotification}>Remove notification</button>
                <p>(Zach make this look nice)</p>
            </div>
        )
    }
}

export default Notification;