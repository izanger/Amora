import React, { Component } from "react"
import Notification from "./Notification.js"

import "./Notifications.css"

class Notifications extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {

        const notifications = this.props.getAppState().user.notifications
        let notificationKeys = null
        if (notifications) {
            notificationKeys = Object.keys(notifications)
        }
        let finalRender;
        if (notifications) {
            finalRender = (
                notificationKeys.map((notificationKey) => {
                    return <Notification key={notificationKey} notificationKey={notificationKey} notification={notifications[notificationKey]}
                    getAppState={this.props.getAppState} setAppState={this.setAppState} />
                })
            )
        } else {
            finalRender = (
                <div>
                    <p className="noNotifications noNotificationsTop">Currently no notifications</p>
                    <p className="noNotifications">:^)</p>
                </div>
            )
        }

        return (
            <div id="taskDashboard">
                <i className="material-icons createProjectButton" onClick={() => {
                    this.props.goToUrl("dashboard")
                }}>backspace</i>
                {finalRender}
            </div>
        )
    }
}

export default Notifications;