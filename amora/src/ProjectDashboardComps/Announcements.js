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

            <div style={{marginBottom: '7px', display: 'flex', flexDirection: 'row'}}>
                <svg width="15px" height="18px" style={{marginRight: '7px'}}>

                    <title>Announcement Megaphone</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="Reiterate-on-Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Desktop" transform="translate(-107.000000, -158.000000)" stroke="#979797">
                            <g id="Announcement-Megaphone" transform="translate(108.000000, 159.000000)">
                                <path d="M12,2.93606037 L12,9.21695947 C10.1921585,9.66724685 8.80398237,10.0656155 7.83547155,10.4120655 C6.86696074,10.7585155 6.25513689,11.0755751 6,11.3632442 L6,0.407182035 C6.80466761,1.14153796 7.41649146,1.59701173 7.83547155,1.77360334 C8.25445165,1.95019495 9.6426278,2.33768063 12,2.93606037 Z" id="Path-4" fill="#979797"></path>
                                <path d="M3.56073718,6 L0,6" id="Path-6" stroke-linecap="round"></path>
                                <path d="M13.5,2.5 L13.5,16.5" id="Line-7" stroke-linecap="round"></path>
                                <path d="M4.07292075,2.7707245 L1.5,1.5" id="Path-5" stroke-linecap="round"></path>
                                <path d="M3.96497152,9.34451526 L1.5,10.5" id="Path-7" stroke-linecap="round"></path>
                            </g>
                        </g>
                    </g>
                </svg>
                <div style={{display: 'flex', 'flex-direction': 'column'}}>
                    <p className="text_small_light">{this.props.data.timestamp}</p>
                    <p id="taskCommentName" style={{marginTop: '-14px'}} className="text_description">{this.props.data.text}</p>

                </div>
            </div>

        )





    }

}

export default Announcements;
