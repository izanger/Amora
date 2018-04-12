import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { Row, Grid, Col } from 'react-bootstrap'
import { checkIfManager } from "../apphelpers.js"
import "./UserIcon.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

import { App } from "../App.js"
import MyDayTitleBar from '../MyDayComps/MyDayTitleBar.js';
import TodayView from '../TodayView.js';
import TodayViewUser from '../TodayViewUser.js';


class UserIcon extends Component {

    constructor() {
      super();

      this.state = {
           open: false,
           iconIsManager: false, //Check apphelpers.js for some functions for checking if a user is a manager - might be helpful here.
           viewingAsManager: false,
           viewSynced: false,
           projects: [],
           profileDescription: ""
        };
       this.color = "#3498DB";
    }

    componentWillReceiveProps(nextProps) {
        if (Object.keys(this.props.project.managerList).includes(this.props.userID)) {
            const newState = this.state
            newState.iconIsManager = true 
            this.setState(newState)
        }
        if (Object.keys(this.props.project.managerList).includes(this.props.getAppState().user.uid)) {
            const newState = this.state
            newState.viewingAsManager = true 
            this.setState(newState)
        }
    }

    componentWillMount() {
        this.getInfo();
        this.getEmail();
        this.getDateJoinedAmora();
        this.getTasksCompleted();
        this.getAllTimeHours();
        this.getOnTimeTasks();
        this.getProfileDesc()
        //console.log(this.props)
        // const promise = checkIfManager(this.props.userID, this.props.projectID)
        // promise.then((data) => {
        //     if (data.val()) {
        //         const newState = this.state
        //         newState.iconIsManager = true 
        //         this.setState(newState)
        //     }
        // })
        // const promise2ElectricBoogaloo = checkIfManager(this.props.getAppState().user.uid, this.props.projectID)
        // promise2ElectricBoogaloo.then((data) => {
        //     if (data.val()) {
        //         const newState = this.state
        //         newState.viewingAsManager = true 
        //         this.setState(newState)
        //     }
        // })
        if (Object.keys(this.props.project.managerList).includes(this.props.userID)) {
            const newState = this.state
            newState.iconIsManager = true 
            this.setState(newState)
        }
        if (Object.keys(this.props.project.managerList).includes(this.props.getAppState().user.uid)) {
            const newState = this.state
            newState.viewingAsManager = true 
            this.setState(newState)
        }
     }

    onOpenModal = () => {
      this.setState({ open: true });
    };

    onCloseModal = () => {
      this.setState({ open: false });
    };

    getInfo() {
        const id = this.props.userID  
        rebase.fetch(`users/${id}/displayName`, {
            context: this,
        }).then(data => {
            let newState = { ...this.state}
            newState.displayName = data
            this.setState(newState);        
        })

    }
    getEmail() {
        const id = this.props.userID  
        rebase.fetch(`users/${id}/email`, {
            context: this,
        }).then(data => {
            let newState = { ...this.state}
            newState.email = data
            this.setState(newState);        
          })
    }

    getDateJoinedAmora() {
        const id = this.props.userID  
        rebase.fetch(`users/${id}/dateJoined`, {
            context: this,
        }).then(data => {
            let newState = { ...this.state}
            newState.dateJoined = data
            this.setState(newState);        
          })
    }

    getTasksCompleted() {
        const id = this.props.userID  
        let newState = { ...this.state}
        rebase.fetch(`users/${id}/taskCompleted`, {
            context: this,
        }).then(data => {
            newState.taskCompleted = data
            this.setState(newState);        
          }).then(() => {
            this.bindingref = rebase.syncState(`users/${id}/taskCompleted`, {
                context: this,
                state: 'taskCompleted',
                then: () => {
                  newState.viewSynced = true
                  this.setState(newState)
                }
            })
        })
    }

    getAllTimeHours() {
        const id = this.props.userID  
        let newState = { ...this.state}
        rebase.fetch(`users/${id}/allTimeHours`, {
            context: this,
        }).then(data => {
            newState.allTimeHours = data
            this.setState(newState);        
          }).then(() => {
            this.bindingref = rebase.syncState(`users/${id}/allTimeHours`, {
                context: this,
                state: 'allTimeHours',
                then: () => {
                  newState.viewSynced = true
                  this.setState(newState)
                }
            })
        })
    }  
    
    getOnTimeTasks() {
        const id = this.props.userID  
        let newState = { ...this.state}
        rebase.fetch(`users/${id}/onTimeTasks`, {
            context: this,
        }).then(data => {
            newState.onTimeTasks = data
            this.setState(newState);        
          }).then(() => {
            this.bindingref = rebase.syncState(`users/${id}/onTimeTasks`, {
                context: this,
                state: 'onTimeTasks',
                then: () => {
                  newState.viewSynced = true
                  this.setState(newState)
                }
            })
        })
    }

    getProfileDesc = () => {
        const id = this.props.userID  
        let newState = { ...this.state }
        rebase.fetch(`users/${id}/profileDescription`, {
            context: this,
        }).then(data => {
            newState.profileDescription = data
            this.setState(newState);        
          }).then(() => {
            this.bindingref = rebase.syncState(`users/${id}/profileDescription`, {
                context: this,
                state: 'profileDescription',
                then: () => {
                  newState.viewSynced = true
                  this.setState(newState)
                }
            })
        })
    }

    removeUser = () => {
        var response = window.confirm("Are you sure you want to remove this user?")
        if (response == true){
            rebase.remove(`users/${this.props.userID}/projects/${this.props.projectID}`)
            rebase.remove(`projects/${this.props.projectID}/userList/${this.props.userID}`)
            rebase.remove(`projects/${this.props.projectID}/managerList/${this.props.userID}`)
        }
    }

    style = () => {

         if (this.state.iconIsManager) {
             return ({
                 backgroundColor: this.color,
                 borderColor: this.props.color,
                 borderWidth: '2px',
                 borderStyle: 'solid'
             })
         } else {
             return ({
                 backgroundColor: this.color,
                 borderColor: this.props.color,
             })

         }
    }


    render = () => {
        const { open } = this.state;
        const hasOnClick = this.props.onClick

        console.log(this.props)

        //Render "remove" button if the user is a manager and isn't viewing themselves
        if(this.state.viewingAsManager && (this.props.userID !== this.props.getAppState().user.uid)){ 
            return (
                <div onClick={() => {
                    if (!hasOnClick) {
                        this.onOpenModal()
                    } else {
                        this.props.onClick()
                    }
                }} id="userIconContainer" style={this.style()}>
                    <img alt={"Project"} src={this.props.user} className="projectPicture"/>
                    {/*This should only appear if it is selected as the project*/}
                    <div id="projectIndicator" style={{backgroundColor: this.color}}></div>
                        <Modal open={open} onClose={this.onCloseModal} little>
                          <h2>Name: {this.state.displayName}<br/>Email: {this.state.email}<br/>
                          Description: {this.state.profileDescription}<br/>
                            Data Joined Amora: {(new Date(this.state.dateJoined).getMonth() + 1) + "/" + new Date(this.state.dateJoined).getDate() + "/" + new Date(this.state.dateJoined).getFullYear()}<br/>
                            All Time Tasks Completed: {this.state.taskCompleted}<br/> All Time Hours Completed: {this.state.allTimeHours}<br/>
                            On Time Percentage: {(Math.round(this.state.onTimeTasks / this.state.taskCompleted * 100)) || 0}%</h2>
                          <button onClick={this.removeUser}>Remove User from Project</button><br></br>
                          <TodayViewUser uid={this.props.userID} getAppState={this.props.getAppState}/>
                        </Modal>
                </div>
            )
        }else {
            return (
                <div onClick={() => {
                    if (!hasOnClick) {
                        this.onOpenModal()
                    } else {
                        this.props.onClick()
                    }
                }} id="userIconContainer" style={this.style()}>
                    <img alt={"Project"} src={this.props.user} className="projectPicture"/>
                    {/*This should only appear if it is selected as the project*/}
                    <div id="projectIndicator" style={{backgroundColor: this.color}}></div>
                        <Modal open={open} onClose={this.onCloseModal} little>
                          <h2>Name: {this.state.displayName}<br/>Email: {this.state.email}<br/>
                          Description: {this.state.profileDescription}<br/>
                            Data Joined Amora: {(new Date(this.state.dateJoined).getMonth() + 1) + "/" + new Date(this.state.dateJoined).getDate() + "/" + new Date(this.state.dateJoined).getFullYear()}<br/>
                            All Time Tasks Completed: {this.state.taskCompleted}<br/> All Time Hours Completed: {this.state.allTimeHours}<br/>
                            On Time Percentage: {(Math.round(this.state.onTimeTasks / this.state.taskCompleted * 100)) || 0}%</h2><br></br>
                          <TodayViewUser uid={this.props.userID} getAppState={this.props.getAppState}/>
                        </Modal>
                </div>
            )
        }
        
    }

}

export default UserIcon;
