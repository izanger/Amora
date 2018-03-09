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
           isManager: false, //Check apphelpers.js for some functions for checking if a user is a manager - might be helpful here.
           displayName: "",
           email: "",
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
                newState.isManager = true 
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

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

    style = () => {

         if (this.state.isManager) {
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
        //console.log(this.props)
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

export default UserIcon;
