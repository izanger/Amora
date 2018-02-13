import React, { Component } from "react"
import { randomKey } from "./apphelpers"

class InviteList extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    renderUser = (user) => {
        return (
            <div key={user + "-" + Math.random(999)} className="inviteListUser">{user}</div>
        )
    }

    render = () => {
        return (
            <div>
                {this.props.users.map((user) => {
                    return (this.renderUser(user))
                })}
            </div>
        )
    }
}

export default InviteList;