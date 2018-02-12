import React, { Component } from "react"

import "./CreateProjectForm.css"

class CreateProjectForm extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {
        return (
            <div id="taskDashboard">
                <i class="material-icons createProjectButton" onClick={() => {
                    this.props.goToUrl("dashboard")
                }}>backspace</i>
                <input type="text" placeholder="Project title" className="createProjectInput" />
                <input type="text" placeholder="Usernames of those you'd like to invite" className="createProjectInput" />
            </div>
        )
    }
}

export default CreateProjectForm;