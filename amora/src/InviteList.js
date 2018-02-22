import React, { Component } from "react"

import "./InviteList.css"

class InviteList extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    renderUser = (user) => {
        return (
            <div key={user + "-" + Math.random(999)} className="inviteEmailAddress">{user.email}</div>
        )
    }

    render = () => {

        const keys = Object.keys(this.props.users)

        return (
            <div>
                {keys.map((key) => {
                    return (this.renderUser(this.props.users[key]))
                })}
            </div>
        )
    }
}

export default InviteList;