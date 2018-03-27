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
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            displayName: "",
            varHours:"",
            sumbitHours:"",
            taskHours:"",
            totalHours:"",
            addMoreHours:"",

          }
          this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        //dropped outside the list
        if (!result.destination) {
            console.log("banana")
            const id = this.props.getAppState().user.uid
            const taskID = result.draggableId;
            rebase.fetch(`users/${id}/todayView/${taskID}`, {
                context: this,
            }).then(data => {
                this.state.addMoreHours = data.EstimatedTimeValue
                this.addHours()
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
                
                                rebase.fetch(`projects/${pid}/taskList/${taskID}`, {
                                    context: this,
                                }).then(data => {
                                    if (data.taskName){
                                        taskname = data.taskName
                                        estimatedTime = data.EstimatedTimeValue
                                        console.log("hit")
                                        this.subtractHours()
                                        
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
                                        this.subtractHours()
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
        else if (result.source.droppableId === "TaskContainer" && result.source.droppableId === "TaskContainer"){
            console.log("no no")
        }
        else {
            console.log(result)
            const id = this.props.getAppState().user.uid
            const taskID = result.draggableId;

            console.log("hey")
           // rebase.fetch()
            rebase.fetch(`users/${id}/todayView/${taskID}`, {
                context: this,
            }).then(data => {
                this.state.addMoreHours = data.EstimatedTimeValue
                this.addHours()
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

    addTaskHours = () => {
    this.state.varHours = document.getElementById("myText").value
    console.log(this.state.varHours)
    document.getElementById("remainingHours1").innerHTML = this.state.varHours
   //var x = document.getElementById("myText").value
  //document.getElementById("hours").innerHTML = x
    }

   subtractHours = () => {
   const newState = this.props.getAppState()
  //var x = document.getElementById("myText").value
   //var inputHours = parseInt(x)||0
   //this.state.sumbitHours=inputHours
   //this.state.totalHours = (parseInt(this.state.totalHours)+parseInt(this.state.taskHours)||0)
   var newOutput = document.getElementById("remainingHours1").innerHTML
   var m = parseInt(newOutput)||0
   //var displayHours = inputHours-parseInt(this.state.totalHours)||0
   var displayHours = m - parseInt(this.state.taskHours)
   if(displayHours < 0)
   displayHours =0
   
   document.getElementById("remainingHours1").innerHTML = displayHours
   this.props.getAppState(newState)
    }

    addHours = () => {
    const newState = this.props.getAppState()
    var outputHours = document.getElementById("remainingHours1").innerHTML
    console.log(outputHours)
    var z = parseInt(outputHours)||0
    var displayAddition = z + parseInt(this.state.addMoreHours)||0
    document.getElementById("remainingHours1").innerHTML = displayAddition
    console.log(displayAddition)
    this.props.getAppState(newState)

    }
  
    submitHoursFunction = () => {
    const newState = this.props.getAppState()
    var submittedButtonHours = document.getElementById("myText").value
    var q = parseInt(submittedButtonHours)||0
    document.getElementById("remainingHours1").innerHTML = q
    this.props.getAppState(newState)
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
                    }}>{notificationText}</i>

                <div style={{"position":"fixed", "top": "4px", "right": "15px"}}>
                    <h4 id="remainingHours">Remaining Hours: </h4>
                    <h4 id="remainingHours1"><b>{this.state.varHours}</b></h4>
                </div>
                <div style={{"position":"fixed", "bottom": "0px", "right": "0px", "display":"flex", "flex-direction": "row"}}>
                    <input id="myText" style={{marginTop: '5px', backgroundColor: 'white', width: '60px'}} placeholder="0" className="createProjectInput"></input>
                    <button type="button" className="addCommentButton" onClick={this.addTaskHours} >Submit Hours of Work Today</button>

                </div>


                

                </div>

                <div style={{width: '100%', height: '100%', backgroundColor: 'whitesmoke'}}>
                    <Switch>
                        <Route path="/dashboard" render={() => {
                            return (
                                <div id="taskDashboard"></div>

                            )
                        }} />
                        <Route path="/projects/:id" render={(props) => <ProjectDashboard {...props}
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

export default Home;
