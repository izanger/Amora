import React, { Component } from 'react'
import rebase from "../rebase";
import settingsIcon from "../images/Icons/Settings.svg"
import searchIcon from "../images/Icons/Search.svg"
import archiveIcon from "../images/Icons/Archive.svg"
import { checkIfManager } from "../apphelpers.js"

import "./ProjectTitleBar.css"

import "./UserIcon.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

class ProjectTitleBar extends Component {

    constructor() {
        super()
    
        this.state = {
            open: false,
            titleValue: "",
            renderAsManager: false,
            projectDescription:"",
            taskAlertTime: "",
        }
    }

    componentWillMount = () => {
        const s = this.state
        s.projectDescription = this.props.projectDescription
        s.titleValue = this.props.title
        this.setState(s)
        const promise = checkIfManager(this.props.getAppState().user.uid, this.props.getAppState().currentProject.key)
        promise.then((data) => {
            if (data.val()) {
                const newState = this.state
                newState.renderAsManager = true 
                //newState.projectDescription = this.props.projectDescription
                this.setState(newState)
            }
        })
        
    }

    componentDidMount = () => {
        const newState = this.state
        newState.colorValue = this.props.getAppState().currentProject.projectColor
        this.setState(newState)
    }

    onOpenModal = () => {
        this.setState({ open: true });
      };
  
    onCloseModal = () => {
        this.setState({ open: false });
    };

    changeTitleValue = (event) => {
        const newState = { ...this.state }
        newState.titleValue = event.target.value
        this.setState(newState)
    }

    changeDescriptionValue = (event) => {
        const newState = { ...this.state }
        newState.projectDescription = event.target.value
        this.setState(newState)
    }

    submitChanges = () => {
        var dropSelect = document.getElementById("taskAlertDropdown");
        var taskAlertText = dropSelect.options[dropSelect.selectedIndex].text;
        const newState = this.props.getAppState();

        if(this.state.renderAsManager){
            newState.currentProject.projectName = this.state.titleValue
            newState.currentProject.projectColor = this.state.colorValue
            newState.currentProject.projectDescription = this.state.projectDescription
            newState.currentProject.taskAlertTime = taskAlertText
            this.props.setAppState(newState)

            rebase.update(`projects/${this.props.getAppState().currentProject.key}`, { //Update project 
                data: {
                    projectName: this.state.titleValue,
                    projectColor: this.state.colorValue,
                    projectDescription: this.state.projectDescription,
                }
            })
            rebase.update(`users/${this.props.getAppState().user.uid}/projects/${this.props.getAppState().currentProject.key}`, { //Update in user's project list
                data: {
                    projectName: this.state.titleValue,
                    projectColor: this.state.colorValue,
                    projectDescription: this.state.projectDescription,
                    taskAlertTime: taskAlertText,
                }
            })

        } else {
            newState.currentProject.taskAlertTime = taskAlertText
            this.props.setAppState(newState)

            rebase.update(`users/${this.props.getAppState().user.uid}/projects/${this.props.getAppState().currentProject.key}`, { //Update in user's project list
                data: {
                    taskAlertTime: taskAlertText,
                }
            })
        }    
    }

    changeColorValue = (color) => {
        const newState = { ...this.state }
        newState.colorValue = color
        this.setState(newState)
    }

    //Returns what should be rendered in the settings pane
    renderSettings = (color, colors) => {
        
        if (!this.state.renderAsManager) { //user is not a manager
            return (
                <div>
                    <h1>User Settings</h1>
                    <h4 style={{marginRight: '5px'}}>Default Task Alert Time:</h4>
                    <select name="taskAlertDropdown" id="taskAlertDropdown">
                        <option value="1">None</option>
                        <option value="2">5 minutes</option>
                        <option value="3">10 minutes</option>
                        <option value="4">15 minutes</option>
                        <option value="5">20 minutes</option>
                        <option value="6">30 minutes</option>
                        <option value="7">60 minutes</option>
                    </select>
                    <button className="submitFinalButton" onClick={this.submitChanges}>Submit</button>
                </div>
            )
        } else { //user is a manager
            return (
                <div>
                    <h1>Manager Settings</h1>
                    <h4>Change Project Name:</h4>
                    <input type="text" placeholder="Enter Project Name" className="createProjectInput" onChange={this.changeTitleValue} value={this.state.titleValue} />
                    <h4>Change Project Description:</h4>
                    <input type="text" onChange={this.changeDescriptionValue} value={this.state.projectDescription}/>
                    <h4 style={{marginRight: '5px'}}>Default Task Alert Time:</h4>
                    <select name="taskAlertDropdown" id="taskAlertDropdown">
                        <option value="1">None</option>
                        <option value="2">5 minutes</option>
                        <option value="3">10 minutes</option>
                        <option value="4">15 minutes</option>
                        <option value="5">20 minutes</option>
                        <option value="6">30 minutes</option>
                        <option value="7">60 minutes</option>
                    </select>`
                    <div id="colorPicker">
                        <h4>Change Project Color:</h4>
                        {colors.map((color) => {
                            return this.renderSwatch(color)
                        })}
                    </div>
                    <button className="submitFinalButton" onClick={this.submitChanges}>Submit</button>
                </div>
            )
        }
        
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

   renderSwatch = (color) => {
        //return <div className="colorSwatchSelector" key={color} style={{backgroundColor: color, borderWidth: '2px', borderStyle: 'solid'}}></div>
        if (color == this.state.colorValue) {
            return <div onClick={() => {
                this.changeColorValue(color)
            }} className="colorSwatchSelector" key={color} style={{backgroundColor: color, borderWidth: '2px', borderStyle: 'solid'}}></div>
        } else {
            return <div onClick={() => {
                this.changeColorValue(color)
            }} className="colorSwatchSelector" key={color} style={{backgroundColor: color}}></div>
        }
    }


    render = () => {
        //let color = "#3CB4CB";
        let color = this.props.projectColor;
        let colors = ['#E74C3C', '#E67E22', '#F1C40F', '#E91E63', '#9B59B6', '#3498DB', '#2ECB71', '#18AE90']
        const { open } = this.state;

        let settings = this.renderSettings(color, colors)
        return (
            <div id="projectTitleContainer" style={{backgroundColor: color}}>
                <h1 id="projectTitle">{this.props.title}</h1>
                <div id="projectTitleLeftContents">
                    {/*<button onClick={this.props.toggleShowArchive}>{this.props.getButtonText()}</button>*/}
                    
                   <img alt={"Settings"} src={settingsIcon} title={"Settings"} onClick={this.onOpenModal} id="projectSettingsIcon"/>
                   <Modal open={open} onClose={this.onCloseModal} little>
                         {settings}
                   </Modal>
                  
                   <img alt={"Search"} src={searchIcon} title={"Search"} style={{right: '55px'}} id="projectSettingsIcon"/>
                   <img alt={"Archive"} src={archiveIcon} title={this.props.getButtonText()} style={{right: '100px'}} onClick={this.props.toggleShowArchive} id="projectSettingsIcon" />
               </div>
            </div>
        )
    }

}

export default ProjectTitleBar;
