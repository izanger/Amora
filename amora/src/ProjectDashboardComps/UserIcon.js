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


        // }
    }


    render = () => {
        const { open } = this.state;

        var divStyle = {
            backgroundColor: this.color,
            borderColor: this.color
        }
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
