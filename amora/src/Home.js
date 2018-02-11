import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import "./Home.css"

class Home extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    signOut = () => {
        const newState = { ...this.props.getAppState }
        newState.user = { }
        this.props.setAppState(newState)
        auth.signOut()
    }

    createProject = () => {
        const project = {
            projectId: 0, 
            title: "Something",
            image: "url",
            users: [ ],
            tasks: [ ]
        }
        rebase.post(`projects/${project.projectId}`, {
            data: project
        })
        console.log("got here")
    }

    render = () => {
        return (
            <div id="mainContainer">
                <div id="projectsSelector">
                    Hello
                    <button onClick={this.signOut}>Sign out</button>
                    <button onClick={this.createProject}>Create project</button>
                </div>

                <div id="taskDashboard">
                    I am a goddamn task
                </div>

                <div id="myDay">
                    This is my day, okay
                </div>
            </div>
        )
    }

}

export default Home;
