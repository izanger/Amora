import React, { Component } from 'react'
import rebase, { auth } from "./rebase.js"
import { Route, Switch, Redirect } from "react-router-dom"

import line from "./images/Line/Line.png"
import "./Home.css"

import ProjectIcon from "./ProjectSelectorComps/ProjectIcon.js"
import CreateProjectForm from './CreateProjectForm.js';
import ProjectDashboard from "./ProjectDashboardComps/ProjectDashboard.js"
import NewProjectButton from "./ProjectSelectorComps/NewProjectButton.js"
import CreateTaskForm from './CreateTaskForm.js';
import Notifications from "./Notifications.js"
import TodayView from "./TodayView.js"
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

  const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k+9}`,
    content: `item ${k+9}`,
  }));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            todayItems: getItems(10),
    
          }
          this.onDragEnd = this.onDragEnd.bind(this);
          //this.handleChange = this.handleChange.bind(this);
    }

    onDragEnd(result) {
        //dropped outside the list
        if (!result.destination) {
          return;
        }
        console.log(result);
        // return;
         if (result.destination.droppableId === "TodayView" && result.source.droppableId === "TaskContainer"){
            //if (result.source.droppableId === "TaskContainer"){
            //add to secondItems
            //add to todayItems and Database
            let projectArray = [];
            let projectColors = [];
            let taskname;
            let estimatedTime;
            //const taskColor;

            //result.draggableId is the key for the task
            //fetch it, save some properties and then push it to today view.
            const id = this.props.getAppState().user.uid   
            const taskID = result.draggableId;
        rebase.fetch(`users/${id}/projects`, {
            context: this,
        }).then(data => {
            console.log(data)   
            projectArray = Object.keys(data);
            projectColors = Object.values(data);
            var i = 0;
            for (i; i < projectArray.length;i++ ){
                let pid = projectArray[i];
                console.log(projectColors[i].projectColor)
                const taskColor = projectColors[i].projectColor
                //return;

                rebase.fetch(`projects/${pid}/taskList/${taskID}`, {
                    context: this,
                }).then(data => {
                    console.log(data)
                    if (data.taskName){
                        console.log(data.taskName)
                        taskname = data.taskName
                        estimatedTime = data.EstimatedTimeValue
                        console.log("PUSHING")


                        //taskName and time are set, so we can push it to the todayView

                        rebase.push(`users/${this.props.getAppState().user.uid}/todayView`, {
                            data: {
                                taskIDNumber: taskID,
                                taskName: taskname,
                                //taskDescription: this.state.descriptionValue,
                                //priorityLevel: selectedText,
                                EstimatedTimeValue: estimatedTime,
                                color: taskColor,
                                //deadline: deadlineFixed,
                                //taskCreator: this.props.getAppState().user.uid,
                
                            }
                        })
                    }
                       


                })
            }
                    
          })


        }
        else {
            //remove from todayItems and database
            const id = this.props.getAppState().user.uid   
            const taskID = result.draggableId;
            console.log("hey")
            rebase.remove(`users/${id}/todayView/${taskID}`, function(err){
                if(!err){
                    console.log("Success: Task removed from Firebase")
                    
                }
                else {
                    console.log("Error: Unit test 3 Failed!")
                }
              });







        }
    
        // const todayItems = reorder(
        //   this.state.todayItems,
        //   result.source.index,
        //   result.destination.index,
        // );
  
    
        // this.setState({
        //   todayItems
        // });
    }


    componentWillMount() {
       this.getName();
    }

    signOut = () => {
        const newState = { ...this.props.getAppState() }
        newState.user = { }
        this.props.setAppState(newState)
        auth.signOut()
    }

    getName() {
        const id = this.props.getAppState().user.uid   
        rebase.fetch(`users/${id}/displayName`, {
            context: this,
        }).then(data => {
            let newState = { ...this.state}
            newState.displayName = data
            this.setState(newState);        
          })
    }
    

    render = () => {

        const projectsList = this.props.getAppState().user.projects
        let projectsKeys
        if (projectsList) {
            projectsKeys = Object.keys(projectsList)
        }
        let projectIcons
        if (projectsList) {
            projectIcons = (
                projectsKeys.map((projectKey) => {
                    return <div key={projectKey} onClick={() => {
                        const newState = { ...this.props.getAppState() }
                        if (newState.project === undefined || newState.project.key !== projectKey && (newState.project.isPersonalDashboardProject === "false")) {
                            newState.currentProject = newState.user.projects[projectKey]
                            this.props.setAppState(newState)
                            this.props.goToUrl(`/projects/${projectKey}`)
                        }
                    }}><ProjectIcon projectID={projectsList[projectKey].key} personalProjectID={this.props.getAppState().user.personalProjectID} projectPhotoURL={projectsList[projectKey].projectPhotoURL}/></div>
                })
            )
        }

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
            <div id="mainContainer">

                <div id="projectsSelector">
                    <div onClick={() => {
                        const newState = { ...this.props.getAppState() }
                        newState.currentProject = newState.user.projects[newState.user.personalProjectID]
                        this.props.setAppState(newState)
                        this.props.goToUrl(`/projects/${newState.user.personalProjectID}`)
                        
                        //this.props.goToUrl("/dashboard")

                    }}><ProjectIcon personalIcon={true} projectPhotoURL={this.props.getAppState().user.photoURL}/></div>

                    <h5 id="projectProfileName">{this.state.displayName}</h5>
                    <img alt={"Seperator"} src={line} id="projectSeparatorLine"/>

                    {projectIcons}

                    <NewProjectButton onClick={() => {
                        this.props.goToUrl("/createproject");
                    }}/>
                    <i onClick={this.signOut} style={{position: 'fixed', bottom: '0'}} className="material-icons">&#xE31B;</i>
                    <i className="material-icons notificationButton" onClick={() => {
                        this.props.goToUrl("/notifications");
                    }}>notifications_none</i>
                </div>
                
                <Switch>
                    <Route path="/dashboard" render={() => {
                        return (
                            <div id="taskDashboard"></div>
                        )
                    }} />
                    <Route path="/projects/:id" render={(props) => <ProjectDashboard {...props} 
                    goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.props.setAppState} /> } />
                    <Route path="/createproject" render={() => {
                        return <CreateProjectForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    <Route path="/notifications" render={() => {
                        return <Notifications goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.setAppState}/>
                    }} />
                    <Route path="/createtask" render={() => {
                        return <CreateTaskForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} />
                    {/* <Route path="/deletetask" render={() => {
                        return <DeleteTaskForm goToUrl={this.props.goToUrl} getAppState={this.props.getAppState}/>
                    }} /> */}
                    <Route render={() => <Redirect to="/dashboard" />} />
                </Switch>

                <div id="myDay">                
                     <TodayView getAppState={this.props.getAppState}/>
                </div>
            </div>
            </DragDropContext>
        )
    }

}

export default Home;
