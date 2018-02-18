import React, { Component } from "react"
import rebase from "./rebase";
import { emailRegistered, validateEmail, buildUserFromGoogle } from "./apphelpers.js"

import "./CreateTaskForm.css"

class CreateTaskForm extends Component {

    // Default constructor instantiates state
    constructor() {
        super()
        this.state = {
            titleValue: "",
            descriptionValue: "",
            estimatedTimeValue: "",
            errorValue: ""

        }
    }

    // Method for changing title value in state
    changeTitleValue = (event) => {
        const newState = { ...this.state }
        newState.titleValue = event.target.value
        this.setState(newState)
    }

    // Method for changing description value in state
    changeDescriptionValue = (event) => {
        const newState = { ...this.state }
        newState.descriptionValue = event.target.value;
        this.setState(newState)
    }

    // Method for changing estimated time value
    changeEstimatedTimeValue = (event) => {
        const newState = { ...this.state }
        newState.estimatedTimeValue = event.target.value;
        this.setState(newState)
    }

    // Checks to see if task is valid or not
    isTaskValid = () => {
        const newState = { ...this.state }
        if (this.state.titleValue === "") {
            newState.errorValue = "Please enter a task title"
            this.setState(newState)
            return false
        } 
        if (this.state.descriptionValue === ""){
            newState.errorValue = "Please enter a task description"
            this.setState(newState)
            return false
        }
        if (this.state.estimatedTimeValue === ""){
            newState.errorValue = "Please enter an estimated time"
            this.setState(newState)
            return false

        }
        return true
    }

    // Let Firebase create a taskID and add all the relevant from the form
    createTask = () => {
        if (!this.isTaskValid()) {
            return
        }
        const ref = rebase.push("projects", {
            data: {
                projectName: this.state.titleValue, 
                projectColor: "black", 
                projectCreator: this.props.getAppState().user.uid
            }
        }).then((newLocation) => {
            rebase.update(`projects/${newLocation.key}`, {
                data: {
                    key: newLocation.key
                }
            })
        })

        // this.state.userList.map((user) => {

        // })

    }

    // Mandatory render method
    render = () => {
        console.log("Hello");
        
        return (
            <div id="taskDashboard">
                <i className="material-icons createTaskButton" onClick={() => {
                    this.props.goToUrl("dashboard")
                }}>backspace</i>
                <input type="text" placeholder="Task title" className="createTaskInput" onChange={this.changeTitleValue}
                value={this.state.titleValue} />
                <input type="text" placeholder="Description of task" className="createTaskInput"
                value={this.state.descriptionValue} onChange={this.changeDescriptionValue} />
                <input type="text" placeholder="Estimated time" className="createTaskInput"
                value={this.state.estimatedTimeValue} onChange={this.changeEstimatedTimeValue} />
                <p className="errorBox">{this.state.errorValue}</p>
                <button className="createTaskInput" onClick={this.createTask}>Add Task</button>
               {/* <input id="checkBox" type="checkbox"> </input> */}
            </div>
        )
    }
}

export default CreateTaskForm;