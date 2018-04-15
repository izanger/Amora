import React, { Component } from "react"
import Notification from "./Notification.js"
import Invite from "./Invite.js"
import NoNotifications from "./NoNotifications.js"
import leftArrow from "./images/Icons/LeftArrow.svg"

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
                    if (notifications[notificationKey].type === "invite") {
                        return <Invite key={notificationKey} notificationKey={notificationKey} notification={notifications[notificationKey]}
                        getAppState={this.props.getAppState} setAppState={this.setAppState} />
                    } 
                    else if (notifications[notificationKey].type === "approval"){
                        return <Approval key={notificationKey} notificationKey={notificationKey} notification={notifications[notificationKey]}
                        getAppState={this.props.getAppState} setAppState={this.setAppState} />
                    }
                    else {
                        return <Notification key={notificationKey} notificationKey={notificationKey} notification={notifications[notificationKey]}
                        getAppState={this.props.getAppState} setAppState={this.setAppState} />
                    }
                })
            )
        } else {
            finalRender = (
                <NoNotifications />
            )
        }

        const color = "#3498DB"

        return (

            <div id="taskDashboard">
                <div id="projectTitleContainer" style={{backgroundColor: color}}>
                    <img src={leftArrow} style={{height: '15px', left: '12px', top:'14px', position:'absolute'}} onClick={() => {
                        this.props.goToUrl("dashboard")
                    }} />
                    <h1 style={{left: '35px'}} id="projectTitle" className="text_header">Notifications</h1>

                </div>
                {finalRender}
            </div>
        )
    }
}

export default Notifications;
