import React, { Component } from 'react'
import rebase, { auth, google} from "../rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import tempPic from "../images/temp.jpg"
import settingsIcon from "../images/Icons/Settings.svg"
import searchIcon from "../images/Icons/Search.svg"
import archiveIcon from "../images/Icons/Archive.svg"
import "./ProjectTitleBar.css"


class ProjectTitleBar extends Component {

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
            <div id="projectTitleContainer" style={{backgroundColor: color}}>
                <h1 id="projectTitle">{this.props.title}</h1>
                <div id="projectTitleLeftContents">
                    {/*<button onClick={this.props.toggleShowArchive}>{this.props.getButtonText()}</button>*/}
                   <img src={settingsIcon} id="projectSettingsIcon"/>
                   <img src={searchIcon} style={{right: '55px'}} id="projectSettingsIcon"/>
                   <img src={archiveIcon} title={this.props.getButtonText()} style={{right: '100px'}} onClick={this.props.toggleShowArchive} id="projectSettingsIcon" />
               </div>
            </div>
        )
    }

}

export default ProjectTitleBar;
