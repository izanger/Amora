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
            newState.errorValue = "Please enter a task title..."
            this.setState(newState)
            return false
        } 
        if (this.state.descriptionValue === ""){
            newState.errorValue = "Please enter a task description..."
            this.setState(newState)
            return false
        }
        if (this.state.estimatedTimeValue === ""){
            newState.errorValue = "Please enter an estimated time..."
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
        const ref = rebase.push(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            data: {
                taskName: this.state.titleValue, 
                taskDescription: this.state.descriptionValue
            }
        }).then((data) => {
            this.props.goToUrl(`/projects/${this.props.getAppState().currentProject.key}`)
        })

    }

    // Mandatory render method
    render = () => {
        
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
            </div>
        )
    }
}

export default CreateTaskForm;