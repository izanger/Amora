import React, { Component } from 'react'

import "./ProjectIcon.css"


class ProjectIcon extends Component {

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
        if(this.props.projectID === this.props.personalProjectID){
            if (this.props.personalIcon == true){
                return (
                    <div id="iconContainer" style={{backgroundColor: color}}>
                        <img alt={"Project"} src={this.props.projectPhotoURL} className="projectPicture"/>
                        {/*This should only appear if it is selected as the project*/}
                        <div id="projectIndicator" style={{backgroundColor: color}}></div>
                    </div>
                )
            } else {
                return (<div></div>)
            }
            
        } else {
            return (
                <div id="iconContainer" style={{backgroundColor: color}}>
                    <img alt={"Project"} src={this.props.projectPhotoURL} className="projectPicture"/>
                    {/*This should only appear if it is selected as the project*/}
                    <div id="projectIndicator" style={{backgroundColor: color}}></div>
                </div>
            )
        }
        
    }

}

export default ProjectIcon;
