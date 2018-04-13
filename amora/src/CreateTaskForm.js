import React, { Component } from "react"
import rebase from "./rebase";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import leftArrow from "./images/Icons/LeftArrow.svg"
import 'react-datepicker/dist/react-datepicker.css';
import "./CreateTaskForm.css"


class CreateTaskForm extends Component {

    // Default constructor instantiates state
    constructor() {
        super()
        this.state = {
            titleValue: "",
            descriptionValue: "",
            errorValue: "",
            estimatedTimeValue: "",
            priorityLevel: "",
            categories: [],
            deadline: moment()
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount = () => {
        //Check in case user was deleted from the project they were creating a task for.
        //If they were, route them back to the dashboard
        rebase.listenTo(`users/${this.props.getAppState().user.uid}/projects/${this.props.getAppState().currentProject.key}`, {
            context: this,
            then(data){
                if(data.key !== this.props.getAppState().currentProject.key){
                  this.props.goToUrl("/dashboard")
                }
            }
        })
        rebase.fetch(`projects/${this.props.getAppState().currentProject.key}/taskCategories`, {
            context: this,
            then(data){
                const newState = { ...this.state }
                newState.categories = Object.keys(data)
                this.setState(newState)
                console.log(newState)
            }
        })
    }

    fixDeadline = (date) => {
        //2018-02-21T18:28:59-05:00
        //const date = date
        //2018  02   21T18:28:59  05:00
        const firstSplit = date.split("-");
        const month = firstSplit[1]; //02
        const year = firstSplit[0];
        //21     18:28:59
        const secondSplit = firstSplit[2].split("T");
        const day = secondSplit[0];
        //time to assemble the pieces dudes
        const finalOutput = "" + month + "/" + day + "/" + year;
        return finalOutput;
    }

    handleChange(date) {
        console.log(date)
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
        if (event.target.value > 9){
            newState.estimatedTimeValue = 9;
        }
        else {
            newState.estimatedTimeValue = Math.round(event.target.value);
        }
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

    dateSelected = (selectedDate) => {
        return selectedDate.format()
    }

    getCategoryOptions() {
        var options = []
        for(var i = 0; i < this.state.categories.length; i++){
            options.push(<option key={i} value={i.toString()}>{this.state.categories[i]}</option>)
        }
        return options;
    }

    // Let Firebase create a taskID and add all the relevant from the form
    createTask = () => {
        if (!this.isTaskValid()) {
            return
        }

        var dropSelect = document.getElementById("dropdown");
        var selectedText = dropSelect.options[dropSelect.selectedIndex].text;

        var categoryDropdown = document.getElementById("categoryDropdown"); //get selected category
        var selectedCategory = categoryDropdown.options[categoryDropdown.selectedIndex].text;

        var deadlineFixed = this.fixDeadline(this.state.deadline.format());

        const newState = { ...this.state }
        newState.priorityLevel = selectedText
        this.setState(newState)
        rebase.push(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            data: {
                taskName: this.state.titleValue,
                taskDescription: this.state.descriptionValue,
                priorityLevel: selectedText,
                taskCategory: selectedCategory,
                EstimatedTimeValue: this.state.estimatedTimeValue,
                deadline: deadlineFixed,
                taskCreator: this.props.getAppState().user.uid,
                titleLocked: false,
                descriptionLocked: false,
                dateLocked: false,
                priorityLocked: false,
                hoursLocked: false,
            }
        }).then((data) => {
            this.props.goToUrl(`/projects/${this.props.getAppState().currentProject.key}`)
            })
    }


    // Mandatory render method
    render = () => {
        let color = "#3498DB";
        let categoryOptions = this.getCategoryOptions();
        return (
            <div id="taskDashboard">
                <div id="projectTitleContainer"  style={{backgroundColor: this.props.getAppState().currentProject.projectColor}}>
                    <img title="Go back" src={leftArrow} style={{height: '15px', left: '12px', top:'14px', position:'absolute'}} onClick={() => {
                        this.props.goToUrl("dashboard")
                    }} />
                    <h1 style={{left: '35px'}} id="projectTitle" className="text_header">Create New Task</h1>

                </div>

                <input type="text" placeholder="Task title" className="createProjectInput" onChange={this.changeTitleValue}
                value={this.state.titleValue} />

                <input type="text" placeholder="Description of task" className="createProjectInput"
                value={this.state.descriptionValue} onChange={this.changeDescriptionValue} />

                <input type="number" placeholder="Estimated time in hours" className="createProjectInput"
                value={this.state.estimatedTimeValue} onChange={this.changeEstimatedTimeValue} />

                <div id="createTaskMoreInfo">
                    <h4>Deadline:</h4><DatePicker placeholder="Deadline" id="dateSelector" selected={this.state.deadline} onChange={this.handleChange}/><br></br>

                    <h4 style={{marginRight: '5px'}}>Priority:</h4>
                    <select name="dropdown" id="dropdown">
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>

                    <h4 style={{marginRight: '5px'}}>Task Category:</h4>
                    <select name="dropdown" id="categoryDropdown">
                        {categoryOptions}
                    </select>
                </div>

                <p className="errorBox">{this.state.errorValue}</p>
                <button className="createProjectFinalButton" onClick={this.createTask}>Add Task</button>
            </div>
        )
    }
}

export default CreateTaskForm;
