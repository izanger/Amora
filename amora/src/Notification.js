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
        return (
            <div>
                <p>You've been assigned to {this.props.notification.taskName} in the project: {this.props.notification.projectName}</p>
                <button onClick={this.removeNotification}>Remove notification</button>
                <p>(Zach make this look nice)</p>
            </div>
        )
    }
}

export default Notification;