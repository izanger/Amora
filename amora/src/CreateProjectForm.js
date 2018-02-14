import React, { Component } from "react"
import rebase from "./rebase";
import InviteList from "./InviteList"
import { createUniqueID, emailRegistered } from "./apphelpers.js"

import "./CreateProjectForm.css"

class CreateProjectForm extends Component {
    constructor() {
        super()
        this.state = {
            titleValue: "",
            inviteValue: "",
            userList: [ ]
        }
    }

    changeTitleValue = (event) => {
        const newState = { ...this.state }
        newState.titleValue = event.target.value
        this.setState(newState)
    }

    changeInviteValue = (event) => {
        const newState = { ...this.state }
        newState.inviteValue = event.target.value;
        this.setState(newState)
    }

    enterInviteValue = (event) => {
        if (event.keyCode == 13) {
            this.inviteUser()
        }
    }

    inviteUser = () => {
        if (this.state.inviteValue !== "") { //email was found in database
            if(emailRegistered(this.state.inviteValue)){
                const newState = { ...this.state }
                newState.inviteValue = "";
                newState.userList.push(this.state.inviteValue)
                this.setState(newState)
            } else { //email was not found in database
                //TODO: Make some visual indication that that user does not exist
            }
        }
    }

    //Old method of creating our own ProjectID
    // createProject = () => {
    //     rebase.post(`projects/${createUniqueID(this.state.titleValue)}`, {
    //         data: { Ben: "WAS HERE" }
    //     })
    // }

    //Let Firebase create a ProjectID and add all the relevant from the form
    createProject = () => {
        rebase.push("projects", {
            data: {projectName: this.state.titleValue, projectColor: "placeholder color", projectCreator: this.props.getAppState().user.uid}
        })
    }

    render = () => {
        return (
            <div id="taskDashboard">
                <i className="material-icons createProjectButton" onClick={() => {
                    this.props.goToUrl("dashboard")
                }}>backspace</i>
                <input type="text" placeholder="Project title" className="createProjectInput" onChange={this.changeTitleValue}
                value={this.state.titleValue} />
                <input type="text" placeholder="Email of person you'd like to invite" className="createProjectInput"
                value={this.state.inviteValue} onChange={this.changeInviteValue} onKeyDown={this.enterInviteValue} />
                <button className="createProjectInput" onClick={this.inviteUser}>Invite user</button>
                <InviteList users={this.state.userList} />
                <button className="createProjectInput" onClick={this.createProject}>Create project</button>
            </div>
        )
    }
}

export default CreateProjectForm;