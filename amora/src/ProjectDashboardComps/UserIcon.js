import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import tempPic from "../images/temp.jpg"
import "./UserIcon.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';


class UserIcon extends Component {

    constructor() {
      super();

      this.state = {
           open: false,
           isManager: true //Check apphelpers.js for some functions for checking if a user is a manager - might be helpful here.
       };
       this.color = "#3CB4CB";
    }

    onOpenModal = () => {
      this.setState({ open: true });
    };

    onCloseModal = () => {
      this.setState({ open: false });
    };

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

    style = () => {

         if(this.state.isManager){
             return ({
                 backgroundColor: this.color,
                 borderColor: this.color,
                 borderColor: this.color,
                 borderWidth: '2px',
                 borderStyle: 'solid'
             })
         } else {
             return ({
                 backgroundColor: this.color,
                 borderColor: this.color,
             })

         }
    }


    render = () => {
        const { open } = this.state;
        return (
            <div onClick={this.onOpenModal} id="userIconContainer" style={this.style()}>
                <img src={tempPic} className="projectPicture"/>
                {/*This should only appear if it is selected as the project*/}
                <div id="projectIndicator" style={{backgroundColor: this.color}}></div>
                    <Modal open={open} onClose={this.onCloseModal} little>
                      <h2>Simple centered modal.<br/><br/>Here is some more text.<br/><br/>The rest of it.</h2>
                    </Modal>
            </div>
        )
    }

}

export default UserIcon;
