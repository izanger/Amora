import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import line from "./images/Line/Line.png"
import "./Home.css"
import ProjectIcon from "./ProjectIcon.js"
import ProjectTitleBar from "./ProjectTitleBar.js"
import ProjectCollaboratorsBar from "./ProjectCollaboratorsBar.js"
import PoppedOutProfile from './PoppedOutProfile';
import AddTaskView from './AddTaskView';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';


class Home extends Component {
    constructor() {
        super()
        this.state = {
            tasks: { },
            counter: 0
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

    addTask = () => {
        var taskName = prompt("Enter the task name");
         const newState = { ...this.state }
         //newState.tasks.push(taskName);
        // newState.counter += 1
        //var arr = this.state.tasks.slice();
        //arr.push(taskName);
         //this.setState({tasks:arr})

         this.setState(prevState => ({
            tasks: [...prevState.tasks, taskName]
        }))


    }

    render = () => {

        const keys = Object.keys(this.state.tasks)

        return (
            <div id="mainContainer">
                <div id="projectsSelector">
                    <PoppedOutProfile />

                    <h5 id="projectProfileName">Name</h5>
                    <img src={line} id="projectSeparatorLine"/>
                    <ProjectIcon />
                    <ProjectIcon />
                    
                    <button onClick={this.signOut}>Sign out</button>
                    <button onClick={this.createProject}>Create project</button>
                    
                </div>

                <div id="taskDashboard">
                    <ProjectTitleBar />
                    <div id="taskDashContainer">
                    <AddTaskView />
                    {/* <button onClick={this.addTask}>Add task</button>
                    {keys.map((key) => {
                        return <div>{this.state.tasks[key]}</div>
                    })} */}

                    </div>
                    <ProjectCollaboratorsBar />

                </div>

                <div id="myDay">
                    This is my day, okay
                </div>
            </div>
        )
    }

}

export default Home;
