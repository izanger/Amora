import React, { Component } from "react"
import rebase from "./rebase";

import "./Invite.css"

class Notification extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {
        return (
            <div>
                <p className="noNotifications noNotificationsTop">Empty notification box</p>
            </div>
        )
    }
}

export default Notification;