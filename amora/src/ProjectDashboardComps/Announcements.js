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

            // <div id="taskNameAndComment">
            //                 <div style={{display: 'flex', 'flex-direction': 'row', 'justify-content': 'space-between'}}>
            //                     <div style={{display: 'flex', 'flex-direction': 'row'}}>
            //                         <p id="taskCommentName" className="text_description">{this.props.username}</p>
            //                         <p id="taskCommentText" className="text_small_light" style={{marginBottom: '0px', marginLeft:'7px'}}>    {isEdited} {formattedDate}</p>
            //                     </div>
            //                     <svg width="6px" height="16px" style={{marginRight: '0px'}} onClick={this.deleteComment} title="Delete Comment">
            //                         <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            //                             <g id="Comment" transform="translate(-663.000000, -2.000000)" stroke-width="1" stroke="#979797">
            //                                 <g id="Settings" transform="translate(666.000000, 10.000000) rotate(90.000000) translate(-666.000000, -10.000000) translate(659.500000, 8.500000)">
            //                                     <circle id="Oval-5" cx="1.5" cy="1.5" r="1.5"></circle>
            //                                     <circle id="Oval-5-Copy" cx="6.5" cy="1.5" r="1.5"></circle>
            //                                     <path d="M11.5,3 C12.3284271,3 13,2.32842712 13,1.5 C13,0.671572875 12.3284271,0 11.5,0 C10.6715729,0 10,0.671572875 10,1.5 C10,2.32842712 10.6715729,3 11.5,3 Z" id="Oval-5-Copy-2"></path>
            //                                 </g>
            //                             </g>
            //                         </g>
            //                     </svg>
            //                 </div>
            //             </div>
            <div>
                <p>{this.props.data.text}</p>
            </div>
        )


   
        

    }

}

export default Announcements;
