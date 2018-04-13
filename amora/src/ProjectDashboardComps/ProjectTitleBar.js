import React, { Component } from 'react'
import rebase from "../rebase";
import settingsIcon from "../images/Icons/Settings.svg"
import searchIcon from "../images/Icons/Search.svg"
import archiveIcon from "../images/Icons/Archive.svg"
import UserIcon from "./UserIcon.js"
import { checkIfManager, checkIfUserOnProject } from "../apphelpers.js"
import { emailRegistered, validateEmail } from "../apphelpers.js"
import InviteList from "../InviteList.js"
import { Route, Switch, Redirect } from "react-router-dom"
import ProjectDashBoard from "./ProjectDashboard.js"
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
            projectDescription:"",
            taskAlertTime: "",
            inviteValue: "",
            userList: [ ],
            userEmails: [ ],
            addManagerOpen: false,
            addProjectCreatorOpen: false,
            demoteManagerOpen: false,
            createNewProjectOpen: false,
            key: "",
            newtitleValue: "",
            newcolorValue: "#E74C3C",
            newdescriptionValue: ""
        }
    }

    // Method for changing title value in state
    changenewTitleValue = (event) => {
        const newState = { ...this.state }
        newState.newtitleValue = event.target.value
        this.setState(newState)
    }

    // Method for changing color value in state
    changenewColorValue = (color) => {
        const newState = { ...this.state }
        newState.newcolorValue = color
        this.setState(newState)
        //console.log(this.state)
    }

    changenewDescriptionValue = (event) => {
        const newState = { ...this.state }
        newState.newdescriptionValue = event.target.value
        this.setState(newState)
    }

    componentWillMount = () => {
        const s = this.state
        s.projectDescription = this.props.projectDescription
        s.titleValue = this.props.title
        this.setState(s)
        // const promise = checkIfManager(this.props.getAppState().user.uid, this.props.getAppState().currentProject.key)
        // promise.then((data) => {
        //     if (data.val()) {
        //         const newState = this.state
        //         newState.renderAsManager = true
        //         //newState.projectDescription = this.props.projectDescription
        //         this.setState(newState)
        //     }
        // })

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
        this.setState({ colorValue: this.props.getProjectDashboardState().project.projectColor })
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

        if(this.props.getProjectDashboardState().project.managerList[this.props.getAppState().user.uid]){
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

            const newKey = this.props.getProjectDashboardState().project.key
            const notification = {
                type: "invite",
                projectName: this.props.getProjectDashboardState().project.projectName,
                projectColor: this.props.getProjectDashboardState().project.projectColor,
                projectPhotoURL: this.props.getProjectDashboardState().project.projectPhotoURL,
                projectDescription: this.props.getProjectDashboardState().project.projectDescription,
                key: newKey,
                taskAlertTime: taskAlertText,
            }
            this.state.userList.map((user) => {
                if (user.email !== this.props.getAppState().user.email) {
                    rebase.update(`users/${user.uid}/notifications/${newKey}`, {
                        data: notification
                    })
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
            newState.errorValue = "Thats already a user in this project..."
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
                newState.errorValue = "You've already invited that user..."
                this.setState(newState)
                return false
            }
            const valKeys = Object.keys(data.val())
            const person = data.val()[valKeys[0]]
            const projectKeys = Object.keys(person.projects)
            if (projectKeys.includes(this.props.getProjectDashboardState().project.key)) {
                newState.errorValue = "That user is already in this project..."
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

    // Method for changins invite value in state
    changeInviteValue = (event) => {
        const newState = { ...this.state }
        newState.inviteValue = event.target.value;
        this.setState(newState)
    }

    demoteManager = (key) => {
        const dashboardState = { ...this.props.getProjectDashboardState() }
        dashboardState.project.managerList[key] = null
        this.props.setProjectDashboardState(dashboardState)
        // this.sendManagerNotification(key)
        this.setState({demoteManagerOpen: false})
    }

    assignManager = (key) => {
        const dashboardState = { ...this.props.getProjectDashboardState() }
        dashboardState.project.managerList[key] = true
        this.props.setProjectDashboardState(dashboardState)
        // this.sendManagerNotification(key)
        this.setState({addManagerOpen: false})
    }

    assignProjectCreator = (key) => {
        const dashboardState = { ...this.props.getProjectDashboardState() }
        dashboardState.project.projectCreator = key
        dashboardState.project.managerList[key] = true
        this.props.setProjectDashboardState(dashboardState)
        // this.sendProjectCreatorNotification(key)
        this.setState({addProjectCreatorOpen: false})
    }

    sendmanagerNotification = (id) => {
        const notification = {
            type: "assignment",
            projectName: this.props.getProjectDashboardState().project.projectName,
            projectColor: this.props.getProjectDashboardState().project.projectColor,
            projectPhotoURL: this.props.getProjectDashboardState().project.projectPhotoURL,
            taskName: this.props.task.taskName
        }
        rebase.update(`users/${id}/notifications/${this.props.taskKey}`, {
            data: notification
        })
    }

    createVanillaProject = () => {
        if (this.state.newdescriptionValue === "" || this.state.newtitleValue === "") {
            return
        }
            rebase.push("projects", {
                data: {
                    projectName: this.state.newtitleValue,
                    projectColor: this.state.newcolorValue,
                    projectCreator: this.props.getProjectDashboardState().project.projectCreator,
                    projectPhotoURL: this.props.getProjectDashboardState().project.projectPhotoURL,
                    projectDescription: this.state.newdescriptionValue,
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
                    rebase.fetch(`projects/${this.state.key}`, {
                        then: (dat) => {
                            const key = this.state.key
                            const notification = {
                                type: "invite",
                                projectName: dat.projectName,
                                projectColor: dat.projectColor,
                                projectPhotoURL: dat.projectPhotoURL,
                                projectDescription: dat.projectDescription,
                                key: key,
                                taskAlertTime: this.props.getAppState().user.projects[this.props.getProjectDashboardState().project.key].taskAlertTime
                            }
                            const userProject = {
                                projectName: dat.projectName,
                                projectPhotoURL: dat.projectPhotoURL,
                                key: key,
                                projectColor: dat.projectColor,
                                projectDescription: dat.projectDescription,
                                isPersonalDashboardProject: "false",
                                taskAlertTime: this.props.getAppState().user.projects[this.props.getProjectDashboardState().project.key].taskAlertTime,
                            }
                            rebase.update(`users/${this.props.getAppState().user.uid}/projects/${key}`, {
                                data: userProject
                            })
                            const userKeys = Object.keys(this.props.getProjectDashboardState().project.userList)
                            userKeys.map((key) => {
                                if (key !== this.props.getAppState().user.uid) {
                                    rebase.update(`users/${key}/notifications/${this.state.key}`, {
                                        data: notification
                                    })
                                }
                            })
                        }
                    })
                })
            })

    }

    renderProjectCreatorButton = () => {
        return (
            <div>
            <button class="addCommentButton" style={{marginRight: '5px'}} onClick={() => {
                this.setState({addProjectCreatorOpen: true})
            }}>Change Creator</button>
            <button class="addCommentButton" style={{marginRight: '5px'}} onClick={() => {
                this.setState({demoteManagerOpen: true})
            }}>Demote Manager</button>
            </div>
        )
    }

    renderSwatch = (color) => {
        if (color == this.state.colorValue) {
        //if(color == this.props.getProjectDashboardState().project.projectColor){
            return <div onClick={() => {
                this.changeColorValue(color)
            }} className="colorSwatchSelector" key={color} style={{backgroundColor: color, borderWidth: '2px', borderStyle: 'solid'}}></div>
        } else {
            return <div onClick={() => {
                this.changeColorValue(color)
            }} className="colorSwatchSelector" key={color} style={{backgroundColor: color}}></div>
        }
    }

    rendernewSwatch = (color) => {
        if (color == this.state.newcolorValue) {
            return <div onClick={() => {
                this.changenewColorValue(color)
            }} className="colorSwatchSelector" key={color} style={{backgroundColor: color, borderWidth: '2px', borderStyle: 'solid'}}></div>
        } else {
            return <div onClick={() => {
                this.changenewColorValue(color)
            }} className="colorSwatchSelector" key={color} style={{backgroundColor: color}}></div>
        }
    }



    //Returns what should be rendered in the settings pane
    renderSettings = (color, colors) => {

        let userKeys
        if (this.props.project.userList) {
            userKeys = Object.keys(this.props.project.userList)
        }
        let isProjectOwner = false
        if (this.props.getProjectDashboardState().project.projectCreator == this.props.getAppState().user.uid) {
            isProjectOwner = true
        }
        let creatorButtons
        if (isProjectOwner) {
            creatorButtons = this.renderProjectCreatorButton()
        }
        let colorsArray = ['#E74C3C', '#E67E22', '#F1C40F', '#E91E63', '#9B59B6', '#3498DB', '#2ECB71', '#18AE90']


        if(!this.props.getProjectDashboardState().project.managerList[this.props.getAppState().user.uid]){ //user is not a manager
            return (
                <div>
                    <h3>User Settings</h3>
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
                <div style={{marginTop: '-20px'}}>
                    <h3>Manager Settings</h3>
                    <div style={{display: 'flex', flexDirection: 'row', 'justify-content': 'space-between', width: '100%'}}>
                        <h4>Update Name:</h4>
                        <input type="text" placeholder="Enter Project Name" style={{marginLeft:'15px', width:'65%', backgroundColor:'white'}} className="createProjectInput" onChange={this.changeTitleValue} value={this.state.titleValue} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', 'justify-content': 'space-between', width: '100%'}}>
                        <h4>Update Description:</h4>
                        <input type="text" className="createProjectInput" style={{marginLeft:'0px', width:'65%', backgroundColor:'white'}} onChange={this.changeDescriptionValue} value={this.state.projectDescription}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                        <h4 style={{marginRight: '15px'}}>Default Task Alert Time:</h4>
                        <select name="taskAlertDropdown" id="taskAlertDropdown" >
                            <option value="1">None</option>
                            <option value="2">5 minutes</option>
                            <option value="3">10 minutes</option>
                            <option value="4">15 minutes</option>
                            <option value="5">20 minutes</option>
                            <option value="6">30 minutes</option>
                            <option value="7">60 minutes</option>
                        </select>
                    </div>

                    <div id="colorPicker" style={{marginLeft:'0px', marginTop: '5px'}}>
                        <h4>Change Project Color:</h4>
                        {colorsArray.map((color) => {
                            return this.renderSwatch(color)
                        })}
                    </div>
                    <div style={{display: 'flex', 'flex-direction': 'row', 'margin-left': '0px', marginTop: '5px'}}>
                    {creatorButtons}
                    <button class="addCommentButton" style={{marginRight: '5px'}} onClick={() => {
                        this.setState({createNewProjectOpen: true})
                    }}>Duplicate Team</button>
                    <button class="addCommentButton" style={{marginRight: '5px'}} onClick={() => {
                        this.setState({addManagerOpen: true})
                    }}>Promote User</button></div>
                    <Modal open={this.state.addProjectCreatorOpen} onClose={() => this.setState({addProjectCreatorOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'promoteToCreatorModal'}}>
                            <div>
                                {/* <h1 className="taskAssignment">Task assignment</h1>*/}
                                <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Promote User to Creator</h4>
                                <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '350px', "overflow": "scrollable"}}>
                                    {userKeys && userKeys.map((key) => {
                                        if (key != this.props.project.projectCreator) {
                                            return (
                                                <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                                                getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                                                onClick={() => {
                                                    this.assignProjectCreator(key)
                                                }} key={key} user={this.props.project.userList[key]} userID={key} project={this.props.project} />
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </Modal>

                    <Modal open={this.state.demoteManagerOpen} onClose={() => this.setState({demoteManagerOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'demoteManagerModal'}}>
                        <div>
                            <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Select a Manager to Demote</h4>
                            <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '350px', "overflow": "scrollable"}}>
                                {userKeys && userKeys.map((key) => {
                                    if (Object.keys(this.props.project.managerList).includes(key) && key != this.props.getAppState().user.uid) {
                                        return (
                                            <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                                            getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                                            onClick={() => {
                                                this.demoteManager(key)
                                            }} key={key} user={this.props.project.userList[key]} userID={key} project={this.props.project} />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </Modal>
                    <Modal open={this.state.createNewProjectOpen} onClose={() => this.setState({createNewProjectOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'copyProjectModal'}}>
                            <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Create Project with Duplicate Team</h4>
                            <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '400px', "display": "flex", "flex-direction": "column"}}>
                                <input type="text" placeholder="Enter Project Name" style={{marginLeft:'15px', width:'65%', backgroundColor:'white'}} className="createProjectInput" onChange={this.changenewTitleValue}
                                value={this.state.newtitleValue} />
                                <input type="text" placeholder="Enter Project Description" style={{marginLeft:'15px', width:'65%', backgroundColor:'white'}} className="createProjectInput"
                                onChange={this.changenewDescriptionValue} value={this.state.newdescriptionValue} />
                            <div id="colorPicker" style={{width: '400px'}}>
                                    <div><h4>Project Color:</h4></div>
                                    {colors.map((color) => {
                                        return this.rendernewSwatch(color)
                                    })}
                                </div>
                                <button className="addCommentButton" style={{marginLeft: '15px', marginTop: '10px', marginBottom: '0px'}} onClick={() => {
                                    this.createVanillaProject()
                                }}>Submit</button>
                            </div>
                    </Modal>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                        <div id="addUserIconProjectContainer" title="Invite User" style={{marginLeft: '0px'}} onClick={this.emailValidationProcess}>
                            <svg height="23" width="23">
                                <line x1="4" y1="9" x2="15" y2="9" style={{strokeWidth: '2px'}} className="newProjectUserPlus" />
                                <line x1="9.5" y1="4" x2="9.5" y2="15" style={{strokeWidth: '2px'}} className="newProjectUserPlus" />
                            </svg>
                            {/*This should only appear if it is selected as the project*/}

                        </div>
                        <Modal open={this.state.addManagerOpen} onClose={() => this.setState({addManagerOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'promoteUserToManagerModal'}}>
                            <div>
                                {/* <h1 className="taskAssignment">Task assignment</h1>*/}
                                <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Promote User to Manager</h4>
                                <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '350px', "overflow": "scrollable"}}>
                                    {userKeys && userKeys.map((key) => {
                                        if (!Object.keys(this.props.project.managerList).includes(key)) {
                                            return (
                                                <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                                                getAppState={this.props.getAppState} projectID={this.props.getProjectDashboardState().project.key}
                                                onClick={() => {
                                                    this.assignManager(key)
                                                }} key={key} user={this.props.project.userList[key]} userID={key} project={this.props.project} />
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </Modal>
                        <input type="text" placeholder="Email of person you'd like to invite" style={{marginLeft:'0px', width:'200%', backgroundColor:'white'}} className="createProjectInput"
                        value={this.state.inviteValue} onChange={this.changeInviteValue} />
                        <div>
                            <p className="errorBox">{this.state.errorValue}</p>
                        </div>
                        <InviteList uid={this.props.getAppState().user.uid} users={this.state.userList} />
                    </div>
                    <button className="submitFinalButton" style={{marginLeft:'0px'}} onClick={this.submitChanges}>Submit</button>
                </div>
            )
        }

    }

    deleteProject = () => {

        let projectUserList = [];
        let usersList = [];
        let projectKey = this.props.getProjectDashboardState().project.key
        rebase.fetch(`projects/${this.props.getProjectDashboardState().project.key}/userList`, {
            context: this,
        }).then(data => {
            usersList = Object.keys(data);
            var i = 0;
            for (i; i < usersList.length;i++ ){
                let uid = usersList[i];
                rebase.remove(`users/${uid}/projects/${projectKey}`)
            }
            rebase.remove(`projects/${projectKey}`)
         }) 
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

    render = () => {
        //let color = "#3CB4CB";
        let color = this.props.projectColor;
        let colors = ['#E74C3C', '#E67E22', '#F1C40F', '#E91E63', '#9B59B6', '#3498DB', '#2ECB71', '#18AE90']
        const { open } = this.state;

        let settings = this.renderSettings(color, colors)
        return (
            
            <div id="projectTitleContainer" style={{backgroundColor: color}}>
                <h3 id="projectTitle">{this.props.title}</h3>
                <h5 id="projectDescription"><i>{this.props.getProjectDashboardState().project.projectDescription}</i></h5>
                <div id="projectTitleLeftContents">
                    {/*<button onClick={this.props.toggleShowArchive}>{this.props.getButtonText()}</button>*/}

                   <img alt={"Settings"} src={settingsIcon} title={"Settings"} onClick={this.onOpenModal} id="projectSettingsIcon"/>
                   <Modal open={open} onClose={this.onCloseModal} little classNames={{overlay: 'settingsPopupOverlay', modal: 'settingsPopupModal'}}>
                         {settings}
                   </Modal>
                    
                   <img alt={"Search"} src={searchIcon} title={"Search"} style={{right: '55px'}} id="projectSettingsIcon"/>
                   <img alt={"Archive"} src={archiveIcon} title={this.props.getButtonText()} style={{right: '100px'}} onClick={this.props.toggleShowArchive} id="projectSettingsIcon" />
                   <button type="button" onClick={this.deleteProject} >Delete Project</button>
               </div>
            </div>
        )
    }

}

export default ProjectTitleBar;
