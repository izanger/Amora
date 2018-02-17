import React, { Component } from "react"
import Notification from "./Notification.js"

class Notifications extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {

        const notifications = this.props.getAppState().user.notifications
        let notificationKeys = null;
        if (notifications) {
            notificationKeys = Object.keys(notifications)
        }

        return (
            <div id="taskDashboard">
                {notifications && notificationKeys &&
                    notificationKeys.map((notificationKey) => {
                        return <Notification key={notificationKey} notification={notifications[notificationKey]} />
                    })
                }
            </div>
        )
    }
}

export default Notifications;