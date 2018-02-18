import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import line from "./images/Line/Line.png"
import "./Home.css"
<<<<<<< HEAD

import ProjectIcon from "./ProjectSelectorComps/ProjectIcon.js"
import CreateProjectForm from './CreateProjectForm.js';
import ProjectDashboard from "./ProjectDashboardComps/ProjectDashboard.js"
import NewProjectButton from "./ProjectSelectorComps/NewProjectButton.js"
import CreateTaskForm from './CreateTaskForm.js';


=======
import ProjectIcon from "./ProjectIcon.js"
import ProjectTitleBar from "./ProjectTitleBar.js"
import ProjectCollaboratorsBar from "./ProjectCollaboratorsBar.js"
>>>>>>> c68f16a38ed541119d725f51d7255ace3456397f


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
                    <ProjectIcon />
                    <h5 id="projectProfileName">Name</h5>
                    <img src={line} id="projectSeparatorLine"/>
                    <ProjectIcon />
<<<<<<< HEAD
                    { <ProjectIcon /> }
=======
                    <ProjectIcon />
                    <button onClick={this.signOut}>Sign out</button>
                    <button onClick={this.createProject}>Create project</button>
                    
                   
                 
                </div>
>>>>>>> c68f16a38ed541119d725f51d7255ace3456397f

                <div id="taskDashboard">
                    <ProjectTitleBar />
                    <div id="taskDashContainer">
                        

                    </div>
                    <ProjectCollaboratorsBar />

                </div>
<<<<<<< HEAD
                
                <Switch>
                    <Route path="/dashboard" render={() => {
                        return (
                            <ProjectDashboard goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} />
                        )
                    }} />
                    <Route path="/createproject" render={() => {
                        return <CreateProjectForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route path="/createtask" render={() => {
                        console.log("hi")
                        return <CreateTaskForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route render={() => <Redirect to="/dashboard" />} />
                </Switch>
=======
>>>>>>> c68f16a38ed541119d725f51d7255ace3456397f

                <div id="myDay">
                    This is my day, okay
                    <input id="checkBox" type="checkbox" />
                    <input id="checkBox" type="checkbox" />
                    <input id="checkBox" type="checkbox" />
                   
                   
                   
                   
                   
                    <button> Submit </button>
                </div>
            </div>
        )
    }

}

export default Home;
