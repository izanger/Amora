import React, { Component } from "react"

class Notification extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {
        return (
            <div>
                <p onClick={() => console.log(this.props.key)}>You've been invited to join: {this.props.notification.projectName}</p>
                <button>Accept</button>
                <button>Decline</button>
                <p>(Zach make this look nice :^)</p>
            </div>
        )
    }
}

export default Notification;