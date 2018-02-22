import React, { Component } from "react"
import rebase from "./rebase";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import leftArrow from "./images/Icons/LeftArrow.svg"
import 'react-datepicker/dist/react-datepicker.css';
// import PropTypes from 'prop-types';
// import Moment from 'react-moment';


import "./CreateTaskForm.css"

class CreateTaskForm extends Component {

    // Default constructor instantiates state
    constructor() {
        super()
        this.state = {
            titleValue: "",
            descriptionValue: "",
            // Implement all other additions of tasks such as
            // Priotity level
            // Users assigned to tasks?
            // Others
            // You get the idea
            // I'm
            // making
            // this
            // longer
            // so
            // people
            // see
            // it
            // incase
            // i forget
            // to tell
            // you

            errorValue: "",
            estimatedTimeValue: "",
            priorityLevel: "",
            deadline: moment()
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
          deadline: date
        });
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

    // Method for changing deadline value
    changeDeadline = (event) => {
        const newState = { ...this.state }
        newState.deadline = event.target.value;
        this.setState(newState)
    }

    // Checks to see if task is valid or not
    isTaskValid = () => {
        const newState = { ...this.state }
        if (this.state.titleValue === "") {
            this.setState(newState)
            return false
        }
        if (this.state.descriptionValue === ""){
            this.setState(newState)
            return false
        }
        if (this.state.estimatedTimeValue === ""){
            this.setState(newState)
            return false

        }
        return true
    }

    myFunction = () => {
        console.log("TESTING")
        document.getElementById("myDropdown").classList.toggle("show");
    }

    // Let Firebase create a taskID and add all the relevant from the form
    createTask = () => {
        if (!this.isTaskValid()) {
            return
        }

        var dropSelect = document.getElementById("dropdown");
        var selectedText = dropSelect.options[dropSelect.selectedIndex].text;

        const newState = { ...this.state }
        newState.priorityLevel = selectedText
        this.setState(newState)

        rebase.push(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            data: {
                taskName: this.state.titleValue,
                taskDescription: this.state.descriptionValue,
                priorityLevel: this.state.priorityLevel,
                EstimatedTimeValue: this.state.estimatedTimeValue,
                deadline: this.state.deadline.format(),
                taskCreator: this.props.getAppState().user.uid,

            }
        }).then((data) => {
            this.props.goToUrl(`/projects/${this.props.getAppState().currentProject.key}`)


            })
    }


    // Mandatory render method
    render = () => {
        let color = "#3498DB";
        return (
            <div id="taskDashboard">
                <div id="projectTitleContainer" style={{backgroundColor: color}}>
                    <img title="Go back" src={leftArrow} style={{height: '30px', left: '12px', top:'14px', position:'absolute'}} onClick={() => {
                        this.props.goToUrl("dashboard")
                    }} />
                    <h1 style={{left: '35px'}} id="projectTitle">Create New Task</h1>

                </div>

                <input type="text" placeholder="Task title" className="createProjectInput" onChange={this.changeTitleValue}
                value={this.state.titleValue} />

                <input type="text" placeholder="Description of task" className="createProjectInput"
                value={this.state.descriptionValue} onChange={this.changeDescriptionValue} />

                <input type="text" placeholder="Estimated time" className="createProjectInput"
                value={this.state.estimatedTimeValue} onChange={this.changeEstimatedTimeValue} />

                <div id="createTaskMoreInfo">
                    <h4>Deadline:</h4><DatePicker placeholder="Deadline" id="dateSelector" selected={this.state.deadline} onChange={this.handleChange}/><br></br>

                    <h4 style={{marginRight: '5px'}}>Priority:</h4>
                    <select name="dropbtn" id="dropdown">
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                </div>

                <p className="errorBox">{this.state.errorValue}</p>
                <button className="createProjectFinalButton" onClick={this.createTask}>Add Task</button>
            </div>
        )
    }
}



export default CreateTaskForm;
