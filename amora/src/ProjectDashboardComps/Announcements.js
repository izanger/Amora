import React, { Component } from 'react'
import rebase from "../rebase.js"
import UserIcon from "./UserIcon.js"
import CommentUserIcon from "./CommentUserIcon.js"
import "./Announcements.css"
import funnytemp from "../images/temp.jpg"
import ContentEditable from 'react-contenteditable'


class Announcements extends Component {

    constructor() {
        super()
        this.state = {
            uid: '',
            annoucementValue: '',
        }
    }

    deleteAnnouncement = () => {
       
        let projectID = this.props.getProjectDashboardState().project.key
            rebase.remove(`projects/${projectID}/announcements`)
        
    }

    changeAnnouncement = (event) => {
        // console.log(this.props)
        if (this.props.uid !== this.props.userID){
                return;
        }
        if (event.target.value.length !== 0) {
            const newState = this.props.getProjectDashboardState()

            //var date = new Date(this.props.timestamp)
            //let formattedDate =  date.toLocaleTimeString() + " on " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
            var today = new Date();
            let e = "Edited at";

           
            
            this.props.setProjectDashboardState(newState)
        }
        
    }

    render = () => {

        return (

            <div id="taskNameAndComment">
                    <div style={{'flex-direction': 'column'}}>
                            <p id="taskCommentName" className="text_description">{this.props.data.text} {this.props.data.timestamp}</p>
                        </div>
                             </div>
                            
        )


   
        

    }

}

export default Announcements;
