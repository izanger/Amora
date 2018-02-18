import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import plusPic from "../images/Plus/Plus@2x.png"
import "./AddUserButton.css"


class AddUserButton extends Component {

    constructor() {
        super()
        this.state = {

        }
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */
    render = () => {
        let color = "#3CB4CB";
        return (
            <div id="addUserIconContainer">
                <svg height="40" width="40">
                    <line x1="19" y1="9" x2="19" y2="29" className="newProjectPlus" />
                    <line x1="9" y1="19" x2="29" y2="19" className="newProjectPlus" />
                </svg>
                {/*This should only appear if it is selected as the project*/}

            </div>
        )
    }

}

export default AddUserButton;
