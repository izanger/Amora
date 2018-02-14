import React, { Component } from "react"
import { randomKey } from "./apphelpers"

import "./InviteList.css"

class InviteList extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    renderUser = (user) => {
        return (
            <div key={user + "-" + Math.random(999)} className="inviteEmailAddress">{user}</div>
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