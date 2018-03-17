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
            <div className="notifcation">
                <p>Youve been assigned to <b style={{color:'black'}}>{this.props.notification.taskName}</b> in the project: <b style={{color:'black'}}>{this.props.notification.projectName}</b></p>
            <button onClick={this.removeNotification} className="addCommentButton" style={{width:'150px'}}>Remove notification</button>
            </div>
        )
    }
}

export default Notification;
