import React, { Component } from "react"

import "./Invite.css"

class Notification extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    getMessage = () => {

    }

    render = () => {

        var messageArray = ['No notifications? You are living the dream, my friend!',
         'It appears that you have no notifications',
         'You have approximately (9-5+2*128/9876)*0 notifications. Just an estimate, though.',
         'Hey, wow, you have no notifications. That is PRETTY neat!',
         'Neat-o, gang! No notifications!',
         'You have no notifications. We can make some fake ones for you, if you would like that.'];
         let message =  messageArray[Math.floor(Math.random() * messageArray.length)]



        return (
            <div>
                <p className="noNotifications noNotificationsTop">{message}</p>
            </div>
        )
    }
}

export default Notification;
