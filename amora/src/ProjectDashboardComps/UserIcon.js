import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Route, Switch, Redirect } from "react-router-dom";
import { Row, Grid, Col } from 'react-bootstrap'
import { checkIfManager } from "../apphelpers.js"
import "./UserIcon.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

import { App } from "../App.js"



class UserIcon extends Component {

    constructor() {
      super();

      this.state = {
           open: false,
           iconIsManager: false, //Check apphelpers.js for some functions for checking if a user is a manager - might be helpful here.
           displayName: "",
           email: "",
           viewingAsManager: false,
        };
       this.color = "#3498DB";
    }

    componentWillMount() {
        this.getInfo();
        this.getEmail();
        const promise = checkIfManager(this.props.userID, this.props.projectID)
        promise.then((data) => {
            if (data.val()) {
                const newState = this.state
                newState.iconIsManager = true 
                this.setState(newState)
            }
        })
        const promise2ElectricBoogaloo = checkIfManager(this.props.getAppState().user.uid, this.props.projectID)
        promise2ElectricBoogaloo.then((data) => {
            if (data.val()) {
                const newState = this.state
                newState.viewingAsManager = true 
                this.setState(newState)
            }
        })
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

    removeUser = () => {
        rebase.remove(`users/${this.props.userID}/projects/${this.props.projectID}`)
        rebase.remove(`projects/${this.props.projectID}/userList/${this.props.userID}`)
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
                          <h2>{this.state.displayName}<br/><br/>{this.state.email}</h2>
                          <button onClick={this.removeUser}>Remove User from Project</button>
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
                          <h2>{this.state.displayName}<br/><br/>{this.state.email}</h2>
                        </Modal>
                </div>
            )
        }
        
    }

}

export default UserIcon;
