import React, { Component } from "react"
import rebase from "./rebase";
import InviteList from "./InviteList"

import leftArrow from "./images/Icons/LeftArrow.svg"
import { emailRegistered, validateEmail, buildUserFromGoogle } from "./apphelpers.js"


import "./CreateProjectForm.css"

class CreateProjectForm extends Component {

    // Default constructor instantiates state
    constructor() {
        super()
        this.state = {
            titleValue: "",
            inviteValue: "",
            errorValue: "",
            colorValue: "DeepSkyBlue",
            userList: [ ],
            userEmails: [ ]
        }
    }

    // Method for changing title value in state
    changeTitleValue = (event) => {
        const newState = { ...this.state }
        newState.titleValue = event.target.value
        this.setState(newState)
    }

    // Method for changins invite value in state
    changeInviteValue = (event) => {
        const newState = { ...this.state }
        newState.inviteValue = event.target.value;
        this.setState(newState)
    }

    // Check to see if user has pressed enter key
    enterInviteValue = (event) => {
        if (event.keyCode === 13) {
            this.inviteUser()
        }
    }

    // Checks to see is this.state.emailValue is valid
    emailValidationProcess = () => {
        if (this.state.inviteValue === "") {
            return false
        }

        const newState = { ...this.state }
        if (!validateEmail(this.state.inviteValue)) {
            newState.errorValue = "Please enter a valid email address..."
            this.setState(newState)
            return false
        }

        if (this.state.inviteValue === this.props.getAppState().user.email) {
            newState.errorValue = "You will be inherently added to the project..."
            this.setState(newState)
            return false
        }

        const promise = emailRegistered(this.state.inviteValue)
        promise.then((data) => {
            if (!data.val()) {
                newState.errorValue = "That email address has not been registered with Amora..."
                this.setState(newState)
                return false
            }
            if (this.state.userEmails.includes(this.state.inviteValue)) {
                newState.errorValue = "You've already added that user to this project..."
                this.setState(newState)
                return false
            }
            const newKey = Object.keys(data.val())
            newState.errorValue = ""
            newState.inviteValue = "";
            newState.userList.push(data.val()[newKey])
            newState.userEmails.push(this.state.inviteValue)
            this.setState(newState)
            //console.log(data.val()[newKey])
            return true
        })
        // TODO:
        // DONE: ////// MAKE USER LIST HOLD USER OBJECTS //////
        // MAKE IT SO USERS GET AN INVITE IN DATABASE
        // WORK ON SYCINGSTATE WITH USERS SO THEIR INVITES WILL BE UPDATED ON THEIR CLIENTS AUTOMATICALLY
        // MAKE INVITE PAGE / ACCEPTING INVTITE LOGIC
    }

    // Checks to see if project is valid or not
    isProjectValid = () => {
        const newState = { ...this.state }
        if (this.state.titleValue === "") {
            newState.errorValue = "Please enter a project title..."
            this.setState(newState)
            return false
        }
        return true
    }

    // Let Firebase create a ProjectID and add all the relevant from the form
    createProject = () => {
        if (!this.isProjectValid()) {
            return
        }
        const tempState = { ...this.state }
        tempState.userEmails.push(this.props.getAppState().user.email)
        tempState.userList.push(this.props.getAppState().user)
        this.setState(tempState)
        rebase.push("projects", {
            data: {
                projectName: this.state.titleValue,
                projectColor: this.state.colorValue,
                projectCreator: this.props.getAppState().user.uid,
                projectPhotoURL: this.props.getAppState().user.photoURL,
                isPersonalDashboardProject: false,
            }
        }).then((newLocation) => {
            let newState = { ...this.state }
            newState.key = newLocation.key
            this.setState(newState)
            rebase.post(`projects/${newLocation.key}/managerList`, { //create list of managers within project, and add the user to it
                data: {
                    [this.props.getAppState().user.uid]: true
                }
            })
            rebase.post(`projects/${newLocation.key}/userList`, { //create list users on project, and add user to it
                data: {
                    [this.props.getAppState().user.uid]: this.props.getAppState().user.photoURL
                }
            })
            rebase.update(`projects/${newLocation.key}`, {
                data: {
                    key: newLocation.key
                }
            }).then((data) => {
                newState = { ...this.state }
                rebase.fetch(`projects/${this.state.key}`, {
                    then: (dat) => {
                        newState.project = dat;
                        this.setState(newState)
                        //console.log(dat)
                        const key = this.state.key
                        rebase.update(`users/${this.props.getAppState().user.uid}/projects/${key}`, {
                            data: dat
                        })
                        this.state.userList.map((user) => {
                            if (user.email !== this.props.getAppState().user.email) {
                                rebase.update(`users/${user.uid}/notifications/${this.state.key}`, {
                                    data: dat
                                })
                                return true
                            }
                            return false
                        })
                    }
                })
            }).then((data) => {
                this.props.goToUrl("/dashboard")
            })
        })

    }

    // Mandatory render method
    render = () => {
        let color = "#3CB4CB";
        return (
            <div id="taskDashboard">
                <div id="projectTitleContainer" style={{backgroundColor: color}}>
                    <img src={leftArrow} style={{height: '30px', left: '12px', top:'14px', position:'absolute'}} onClick={() => {
                        this.props.goToUrl("dashboard")
                    }} />
                    <h1 style={{left: '35px'}} id="projectTitle">Create New Project</h1>

                </div>
                <input type="text" placeholder="Enter Project Name" className="createProjectInput" onChange={this.changeTitleValue}
                value={this.state.titleValue} />

                <div id="colorPicker">
                    <h4>Project Color:</h4>
                    {/* BEN THIS IS WHERE THE COLORS WILL GO, MY DUDE*/}
                    <div className="colorSwatchSelector"></div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <div id="addUserIconProjectContainer" title="Invite User" onClick={this.emailValidationProcess}>
                        <svg height="23" width="23">
                            <line x1="4" y1="9" x2="15" y2="9" style={{strokeWidth: '2px'}} className="newProjectUserPlus" />
                            <line x1="9.5" y1="4" x2="9.5" y2="15" style={{strokeWidth: '2px'}} className="newProjectUserPlus" />
                        </svg>
                        {/*This should only appear if it is selected as the project*/}

                    </div>
                    <input type="text" placeholder="Email of person you'd like to invite" className="createProjectInput"
                    value={this.state.inviteValue} onChange={this.changeInviteValue} onKeyDown={this.enterInviteValue} style={{width: '100%'}}/>
                </div>
                <div >
                    <p className="errorBox">{this.state.errorValue}</p>
                </div>

                {/*}<button className="createProjectInput" onClick={this.emailValidationProcess}>Invite user</button>*/}
                <InviteList users={this.state.userList} />
                <button className="createProjectFinalButton" onClick={this.createProject}>Create project</button>
            </div>
        )
    }
}

export default CreateProjectForm;
