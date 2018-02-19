import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import plusPic from "../images/Plus/Plus@2x.png"
import "./NewProjectButton.css"


class NewProjectButton extends Component {

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
            <div onClick={this.props.onClick} id="newProjectIconContainer">
                <svg height="60" width="60">
                    <line x1="29" y1="19" x2="29" y2="39" className="newProjectPlus" />
                    <line x1="19" y1="29" x2="39" y2="29" className="newProjectPlus" />
                </svg>
                {/*This should only appear if it is selected as the project*/}
                <div id="projectIndicator" style={{backgroundColor: color}}></div>
            </div>
        )
    }

}

export default NewProjectButton;
