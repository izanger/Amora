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
import MyDayTitleBar from "./MyDayComps/MyDayTitleBar.js"
// import { doubleToIEEE754String } from '@firebase/database/dist/esm/src/core/util/util';
import Notifications from "./Notifications.js"
import TodayView from "./TodayView.js"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import GroupChat from './ProjectDashboardComps/GroupChat.js';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            taskHours:"",
            width: 0,
            height: 0,
            todayViewHours: 0,
            viewSynced: false,
          }
          this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
          this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        //dropped outside the list
        if (!result.destination) {
            const id = this.props.getAppState().user.uid
            const taskID = result.draggableId;
            rebase.fetch(`users/${id}/todayView/${taskID}`, {
                context: this,
            }).then(data => {
                let newState = { ...this.state}
                //newState.todayViewHours = newState.todayViewHours + data.EstimatedTimeValue
                this.setState(newState)
            })


            rebase.remove(`users/${id}/todayView/${taskID}`).then(() => {

                let count;
                const id = this.props.getAppState().user.uid
                const taskID = result.draggableId;
                let todayCount = [];

                rebase.fetch(`users/${id}/count`, {
                    context: this,

                  }).then(data => {
                    todayCount = Object.values(data);
                    if (!Number.isInteger(data)){
                        console.log("contact Alex. This should never happen")
                    }
                    else {
                        //count is defined, so use it
                        //BUT we need to honor where they are dropping it which makes me so sad on the
                        //inside. Guys I REALLY don't want to do this. :(
                        //JK this is gonna be cool watch this.

                        //first lets grab where they want to drop it
                        //var dropitHere = result.destination.index;
                        var droppedFrom = result.source.index;

                        //everything before that index is EHHHHH OK
                        //but we need to bop everything after that index +1
                        //data stores an int that is the num of things in the todayview
                        //console.log("Drop At: " + dropitHere)

                        count = data

                        rebase.fetch(`users/${id}/todayView`, {
                            context: this,

                          }).then(data => {

                            let dataKeys = Object.keys(data)
                            //cases
                            //if move down list
                            //item in desired spot moves up
                            //if move up list
                            //item in desired spot moves down

                            for(var i = 0; i < count-1; i++){

                               if (droppedFrom < data[dataKeys[i]].index){
                                   //if index is lower on list than drop location\
                                   data[dataKeys[i]].index = data[dataKeys[i]].index - 1;
                                   continue;
                               }
                            }

                            rebase.update(`users/${id}/todayView`, {
                                data: data,
                                then(err){
                                    rebase.update(`users/${id}`, {
                                        data: {count: count-1}
                                      }).then(() => {
                                        return;
                                      })
                                }
                              });
                            })
                    }
                  })
                  return;
            })
              return;
        }
        else if (result.destination.droppableId === "TodayView" && result.source.droppableId === "TodayView"){
            //reorder within todayView
            //this should be easier. Just swap components around. Probably gonna be hard still lol
            let count;
            const id = this.props.getAppState().user.uid
            const taskID = result.draggableId;
            let todayCount = [];

            rebase.fetch(`users/${id}/count`, {
                context: this,
              }).then(data => {

                todayCount = Object.values(data);
                if (!Number.isInteger(data)){
                    console.log("contact Alex. This should never happen")
                }
                else {
                    //count is defined, so use it
                    //BUT we need to honor where they are dropping it which makes me so sad on the
                    //inside. Guys I REALLY don't want to do this. :(
                    //JK this is gonna be cool watch this.

                    //first lets grab where they want to drop it
                    var dropitHere = result.destination.index;
                    var droppedFrom = result.source.index;

                    //everything before that index is EHHHHH OK
                    //but we need to bop everything after that index +1
                    //data stores an int that is the num of things in the todayview
                    count = data

                    rebase.fetch(`users/${id}/todayView`, {
                        context: this,
                      }).then(data => {
                        let dataKeys = Object.keys(data)
                        //cases
                        //if move down list
                        //item in desired spot moves up
                        //if move up list
                        //item in desired spot moves down

                        for(var i = 0; i < count; i++){
                           if (data[dataKeys[i]].index == droppedFrom){
                                data[dataKeys[i]].index = dropitHere;
                                continue;
                           }
                           else if (data[dataKeys[i]].index <= dropitHere && droppedFrom < data[dataKeys[i]].index){
                               //if index is lower on list than drop location
                               data[dataKeys[i]].index = data[dataKeys[i]].index - 1;
                               continue;
                           }
                           else if (data[dataKeys[i]].index >= dropitHere && droppedFrom > data[dataKeys[i]].index){
                                //if index is lower on list than drop location
                                data[dataKeys[i]].index = data[dataKeys[i]].index + 1;
                                continue;
                            }

                        }
                        rebase.update(`users/${id}/todayView`, {
                            data: data,
                            then(err){
                                    return;
                            }
                          });
                        })
                }
              })
              return;
        }
         else if (result.destination.droppableId === "TodayView" && result.source.droppableId === "TaskContainer"){
            //add to secondItems
            //add to todayItems and Database
            let projectArray = [];
            let projectColors = [];
            let taskname;
            let estimatedTime;
            let completedStatus;
            //const taskColor;
            let count;
            console.log(result)
            const id = this.props.getAppState().user.uid
            const taskID = result.draggableId;
            let todayCount = [];
            console.log("ererer")

            rebase.fetch(`users/${id}/count`, {
                context: this,
              }).then(data => {
                todayCount = Object.values(data);
                if (!Number.isInteger(data)){
                    //no count has been stored. So count = 0
                    count = 1;

                    rebase.update(`users/${id}`, {
                        data: {count: 1}
                      }).then(() => {

                        //add the task to the todayView
                        rebase.fetch(`users/${id}/projects`, {
                            context: this,
                        }).then(data => {
                            projectArray = Object.keys(data);
                            projectColors = Object.values(data);
                            var i = 0;
                            for (i; i < projectArray.length;i++ ){
                                let pid = projectArray[i];
                                const taskColor = projectColors[i].projectColor
                                console.log(taskID)
                                rebase.fetch(`projects/${pid}/taskList/${taskID}`, {
                                    context: this,
                                }).then(data => {
                                    console.log(data)
                                    if (data.taskName){
                                        taskname = data.taskName
                                        estimatedTime = data.EstimatedTimeValue
                                        console.log("hit")
                                        //this.subtractHours()
                                        let newState = { ...this.state}
                                        newState.todayViewHours = newState.todayViewHours - data.EstimatedTimeValue
                                        this.setState(newState)


                                        if (data.completed){
                                        completedStatus = data.completed
                                        }
                                        else {
                                            completedStatus = false;
                                        }
                                        //taskName and time are set, so we can push it to the todayView
                                        this.state.taskHours = data.EstimatedTimeValue,
                                        rebase.push(`users/${this.props.getAppState().user.uid}/todayView`, {
                                            data: {
                                                taskIDNumber: taskID,
                                                taskName: taskname,
                                                EstimatedTimeValue: estimatedTime,
                                                color: taskColor,
                                                completed: completedStatus,
                                                index: count-1,
                                            }
                                        })
                                    }
                                })
                            }
                          })
                      })
                }
                else {
                    //count is defined, so use it
                    //BUT we need to honor where they are dropping it which makes me so sad on the
                    //inside. Guys I REALLY don't want to do this. :(
                    //JK this is gonna be cool watch this.

                    //first lets grab where they want to drop it
                    var dropitHere = result.destination.index;

                    //everything before that index is EHHHHH OK
                    //but we need to bop everything after that index +1
                    //data stores an int that is the num of things in the todayview
                    count = data
                    rebase.fetch(`users/${id}/todayView`, {
                        context: this,
                      }).then(data => {
                        let dataKeys = Object.keys(data)
                        for(var i = 0; i < count; i++){
                            if (data[dataKeys[i]].index >= dropitHere){
                                data[dataKeys[i]].index = data[dataKeys[i]].index + 1;
                            }
                        }
                        rebase.update(`users/${id}/todayView`, {
                            data: data
                          }).then(() => {
                     count = count + 1;

                    rebase.update(`users/${id}`, {
                        data: {count: count}
                      }).then(() => {

                        //add the task to the todayView
                        rebase.fetch(`users/${id}/projects`, {
                            context: this,
                        }).then(data => {
                            projectArray = Object.keys(data);
                            projectColors = Object.values(data);
                            var i = 0;
                            for (i; i < projectArray.length;i++ ){
                                let pid = projectArray[i];
                                const taskColor = projectColors[i].projectColor
                                rebase.fetch(`projects/${pid}/taskList/${taskID}`, {
                                    context: this,
                                }).then(data => {
                                    if (data.taskName){
                                        taskname = data.taskName
                                        this.state.taskHours = data.EstimatedTimeValue
                                        estimatedTime = data.EstimatedTimeValue
                                        console.log("hit")
                                        //this.subtractHours()
                                        let newState = { ...this.state}
                                        newState.todayViewHours = newState.todayViewHours - data.EstimatedTimeValue
                                        this.setState(newState)
                                        if (data.completed){
                                        completedStatus = data.completed
                                        }
                                        else {
                                            completedStatus = false;
                                        }
                                        //taskName and time are set, so we can push it to the todayView

                                        rebase.push(`users/${this.props.getAppState().user.uid}/todayView`, {
                                            data: {
                                                taskIDNumber: taskID,
                                                taskName: taskname,
                                                EstimatedTimeValue: estimatedTime,
                                                color: taskColor,
                                                completed: completedStatus,
                                                index: dropitHere,
                                            }
                                        })
                                    }
                                })
                            }
                          })
                      })
                          })
                      })
                }
              })
        }
        else {
            const id = this.props.getAppState().user.uid
            const taskID = result.draggableId;

            console.log("hey")
           // rebase.fetch()
            rebase.fetch(`users/${id}/todayView/${taskID}`, {
                context: this,
            }).then(data => {
                let newState = { ...this.state}
                newState.todayViewHours = newState.todayViewHours + data.EstimatedTimeValue
                this.setState(newState)
                //this.addHours()
            })



            rebase.remove(`users/${id}/todayView/${taskID}`).then(() => {

                let count;
                const id = this.props.getAppState().user.uid
                const taskID = result.draggableId;
                let todayCount = [];

                rebase.fetch(`users/${id}/count`, {
                    context: this,

                  }).then(data => {
                    todayCount = Object.values(data);
                    if (!Number.isInteger(data)){
                        console.log("contact Alex. This should never happen")
                    }
                    else {
                        //count is defined, so use it
                        //BUT we need to honor where they are dropping it which makes me so sad on the
                        //inside. Guys I REALLY don't want to do this. :(
                        //JK this is gonna be cool watch this.

                        //first lets grab where they want to drop it
                        //var dropitHere = result.destination.index;
                        var droppedFrom = result.source.index;

                        //everything before that index is EHHHHH OK
                        //but we need to bop everything after that index +1
                        //data stores an int that is the num of things in the todayview
                        //console.log("Drop At: " + dropitHere)

                        count = data

                        rebase.fetch(`users/${id}/todayView`, {
                            context: this,

                          }).then(data => {

                            let dataKeys = Object.keys(data)
                            //cases
                            //if move down list
                            //item in desired spot moves up
                            //if move up list
                            //item in desired spot moves down

                            for(var i = 0; i < count-1; i++){

                               if (droppedFrom < data[dataKeys[i]].index){
                                   //if index is lower on list than drop location\
                                   data[dataKeys[i]].index = data[dataKeys[i]].index - 1;
                                   continue;
                               }
                            }

                            rebase.update(`users/${id}/todayView`, {
                                data: data,
                                then(err){
                                    rebase.update(`users/${id}`, {
                                        data: {count: count-1}
                                      }).then(() => {
                                        return;
                                      })
                                }
                              });
                            })
                    }
                  })
                  return;
            })
              return;
        }
    }

    componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount(){
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    componentWillMount() {
       this.getTodayHours();
       this.getName();
    }

    getTodayHours() {
        const id = this.props.getAppState().user.uid
        rebase.fetch(`users/${id}/todayView`, {
            context: this,
            asArray: true,
        }).then(data => {
            let newState = { ...this.state}
            let sum = 0;

            let taskArray = Object.values(data);
                   console.log(taskArray)
                 for (var i = 0; i < taskArray.length;i++ ){
                     sum = sum + taskArray[i].EstimatedTimeValue;
                 }

            rebase.fetch(`users/${this.props.getAppState().user.uid}/workingHours/hours`, { 
                context: this,
            }).then(data => {
                if (Number.isInteger(sum)) {
                    newState.todayViewHours = data-sum;
                    this.setState(newState);
                }  
            }).then(() => {
                this.bindingref = rebase.syncState(`users/${this.props.getAppState().user.uid}/workingHours/hours`, {
                    context: this,
                    state: 'workingHours',
                    then: () => {
                        console.log("HELLO")
                        newState.viewSynced = true
                        this.setState(newState)
                    }
                })
            })
          })


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

            if (Number.isInteger(data.length)) {
                var split = data.split(" ")
                newState.displayName = split[0]
                this.setState(newState);
            }

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
                        //if (newState.currentProject === undefined || newState.currentProject.key !== projectKey && (newState.currentProject.isPersonalDashboardProject === "false")) {
                            newState.currentProject = newState.user.projects[projectKey]
                            this.props.setAppState(newState)
                            this.props.goToUrl(`/projects/${projectKey}`)
                        //}
                    }}><ProjectIcon projectID={projectsList[projectKey].key} personalProjectID={this.props.getAppState().user.personalProjectID} projectPhotoURL={projectsList[projectKey].projectPhotoURL}/></div>
                })
            )
        }

        let notificationText
        if (this.props.getAppState().user.notifications) {
            notificationText = "notifications_active"
        } else {
            notificationText = "notifications_none"
        }

        if (this.state.width < 500){
            return (
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div id="myDay">
                        <TodayView getAppState={this.props.getAppState}/>
                    </div>
                </DragDropContext>
            )
        } else {
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

                    <h5 id="projectProfileName" className="text_description">{this.state.displayName}</h5>
                        <img alt={"Seperator"} src={line} id="projectSeparatorLine"/>

                        {projectIcons}

                        <NewProjectButton onClick={() => {
                            this.props.goToUrl("/createproject");
                        }}/>
                        <i onClick={this.signOut} style={{position: 'fixed', bottom: '0'}} className="material-icons">&#xE31B;</i>
                        <i className="material-icons notificationButton" onClick={() => {
                            this.props.goToUrl("/notifications");
                        }}>{notificationText}</i>

                    <div style={{"position":"fixed", "top": "4px", "right": "15px"}}>
                        <h4 id="remainingHours">Remaining Hours: </h4>
                        <h4 id="remainingHours1"><b>{this.state.todayViewHours}</b></h4>
                    </div>
                    <div style={{"position":"fixed", "bottom": "0px", "right": "0px", "display":"flex", "flex-direction": "row"}}>
                        {/* <input id="myText" style={{marginTop: '5px', backgroundColor: 'white', width: '60px'}} placeholder="0" className="createProjectInput"></input> */}
                        {/* <button type="button" className="addCommentButton" onClick={this.addTaskHours} >Submit Hours of Work Today</button> */}

                    </div>




                    </div>

                    <div style={{width: '100%', height: '100%', backgroundColor: '#F8F8F8'}}>
                        <Switch>
                            <Route path="/dashboard" render={() => {
                                return (
                                    <div id="taskDashboard"></div>

                                )
                            }} />
                            <Route path="/projects/:id" render={(props) => <ProjectDashboard {...props}
                                goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.props.setAppState}
                                goBack={this.props.goBack}/> } />
                            <Route path="/chats/:id" render={(props) => <GroupChat {...props}
                                goToUrl={this.props.goToUrl} getAppState={this.props.getAppState} setAppState={this.props.setAppState}
                                goBack={this.props.goBack}/> } />
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
                    </div>


                    {/* <div id="myDay">
                        <MyDayTitleBar /> */}
                    <div id="myDay">
                         <TodayView getAppState={this.props.getAppState}/>
                    </div>
                </div>
                </DragDropContext>
            )
        }

    }


}

export default Home;
