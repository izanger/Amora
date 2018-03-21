import React, { Component } from 'react'
import rebase from "../rebase.js"
import Task from "./Task.js"
import ProjectTitleBar from "./ProjectTitleBar.js"
import ProjectCollaboratorsBar from "./ProjectCollaboratorsBar.js"
import "./ProjectDashboard.css"
import NewProjectButton from "../ProjectSelectorComps/NewProjectButton.js"


class ProjectDashboard extends Component {

    constructor() {
        super()
        this.state = {
            projectSynced: false,
            showArchive: false,
            project: {

            }
        }
    }

    /*
    This currently only is the box. It needs the following:
    1) Get the color for the project from Firebase
    2) Some way of knowing if it's currently selected
    3) If it's selected, stay expanded to the square
    4) If it's selected, have the box show on the side
    */

    componentDidMount = () => {
        const newState = { ...this.state }
        rebase.fetch(`projects/${this.props.match.params.id}`, {
            context: this,
            then: (data) => {
                newState.project = data
            }
        }).then(() => {
            this.bindingref = rebase.syncState(`projects/${this.props.match.params.id}`, {
                context: this,
                state: 'project',
                then: () => {
                    newState.projectSynced = true
                    this.setState(newState)

                    //Check in case user was deleted from the project they are viewing
                    //If they were, route them back to the dashboard
                    rebase.listenTo(`users/${this.props.getAppState().user.uid}/projects/${this.props.match.params.id}`, {
                        context: this,
                        then(data){
                            if(data.key !== this.props.match.params.id){
                                this.props.goToUrl("/dashboard")
                            }
                        }
                    })
                }
            })
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const nextId = nextProps.match.params.id
        this.setState({projectSynced: false})
        if (nextId !== this.props.match.params.id) {
            this.setState({projectSynced: false})
            if (this.bindingref) {
                rebase.removeBinding(this.bindingref)
            }
            const newState = { ...this.state }
            rebase.fetch(`projects/${nextId}`, {
                context: this,
                then: (data) => {
                    newState.project = data
                }
            }).then(() => {
                this.bindingref = rebase.syncState(`projects/${nextId}`, {
                    context: this,
                    state: 'project',
                    then: () => {
                        newState.projectSynced = true
                        this.setState(newState)
                    }
                })
            })
        }
        this.setState({projectSynced: true})
    }

    componentWillUnmount = () => {
        this.setState({
            projectSynced: false
        })
    }

    toggleShowArchive = () => {
        if(this.state.showArchive){
            this.setState({showArchive: false})
        } else {
            this.setState({showArchive: true})
        }

    }

    getButtonText = () => {
        if(this.state.showArchive){
            return "Show Active Tasks"
        } else {
            return "Show Archived Tasks"
        }
    }

    setProjectDashboardState = (newState) => {
        this.setState(newState)
    }

    getProjectDashboardState = () => {
        return this.state
    }

    createTask = () => {

        rebase.push(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            data: {
                taskName: "Unit Test Task",
                taskDescription: "This is a unit test",
                priorityLevel: "High",
                EstimatedTimeValue: "10",
                deadline: "02/23/2018",
                taskCreator: this.props.getAppState().user.uid,

            }
        }).then((data) => {
            this.props.goToUrl(`/projects/${this.props.getAppState().currentProject.key}`)
            })
            
            console.log("Success: Task created");
    }

    checkInDataBase = () => {

        rebase.fetch(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            context: this,
            asArray: true
          }).then(data => {
            //console.log(data);
            let present = false;
            const name = "Unit Test Task"
            for (let tasks of data) {
                //console.log(tasks);
                if (tasks.taskName === name){
                    present = true;
                }
            }
            if (present){
                console.log("Success: Task stored in Firebase")
            }
            else {
                console.log("ERROR: Unit test 3 Failed!")
            }

            console.log("Running test 4: Sync Estimated Time")
            //this.createTask()
            this.sleep(10000)
            this.findEstimatedTime()
            //this.removeTask()
            this.sleep(10000)

          }).catch(error => {
            //handle error
            console.log("ERROR: Unit test 2 Failed!")
          })

    }

    removeTask = () => {
        let taskKeyID = ""
        rebase.fetch(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            context: this,
            asArray: true
          }).then(data => {
            //console.log(data);
            let present = false;
            
            const name = "Unit Test Task"
            for (let tasks of data) {
                //console.log(tasks);
                if (tasks.taskName === name){
                    taskKeyID = tasks.key
                }
            }
        })
    


            rebase.remove(`projects/${this.props.getAppState().currentProject.key}/taskList/${taskKeyID}`, function(err){
                if(!err){
                    console.log("Success: Task removed from Firebase")
                    
                }
                else {
                    console.log("Error: Unit test 3 Failed!")
                }
              });
    }

    findEstimatedTime = () => {
        console.log("Estimated time on task: 10")

        let taskTime = ""
        rebase.fetch(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            context: this,
            asArray: true
          }).then(data => {
            //console.log(data);
            let present = false;
            
            const name = "Unit Test Task"
            for (let tasks of data) {
                //console.log(tasks);
                if (tasks.taskName === name){
                    taskTime = tasks.EstimatedTimeValue
                    console.log(tasks.EstimatedTimeValue)
                }
            }
            console.log("Estimated time in database: " + taskTime)
        if (taskTime == 10){
            console.log("Success: Estimated Time synced with Firebase!")
        }
        else {
            console.log("ERROR: Unit Test 4 Failed!")
        }
        })
        // console.log("Estimated time in database: " + taskTime)
        // if (taskTime == 10){
        //     console.log("Success: Estimated Time synced with Firebase!")
        // }
        // else {
        //     console.log("ERROR: Unit Test 4 Failed!")
        // }

    }

    findDeadlineDate = () => {
        console.log("Deadline on task: 02/23/2018")

        let taskDeadline = ""
        rebase.fetch(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            context: this,
            asArray: true
          }).then(data => {
            //console.log(data);
            let present = false;
            
            const name = "Unit Test Task"
            for (let tasks of data) {
                //console.log(tasks);
                if (tasks.taskName === name){
                    taskDeadline = tasks.deadline
                }
            }
            console.log("Deadline in database: " + taskDeadline)
        if (taskDeadline === "02/23/2018"){
            console.log("Success: Deadline synced with Firebase!")
        }
        else {
            console.log("ERROR: Unit Test 5 Failed!")
        }
        })
        // console.log("Deadline in database: " + taskDeadline)
        // if (taskDeadline === "02/23/2018"){
        //     console.log("Success: Deadline synced with Firebase!")
        // }
        // else {
        //     console.log("ERROR: Unit Test 5 Failed!")
        // }
    }

    findPriorityLevel = () => {

        console.log("Priority on task: High")

        let taskPriority = ""
        rebase.fetch(`projects/${this.props.getAppState().currentProject.key}/taskList`, {
            context: this,
            asArray: true
          }).then(data => {
            //console.log(data);
            let present = false;
            
            const name = "Unit Test Task"
            for (let tasks of data) {
                //console.log(tasks);
                if (tasks.taskName === name){
                    taskPriority = tasks.priorityLevel
                }
            }
            console.log("Priority Level in database: " + taskPriority)
            if (taskPriority === "High"){
                console.log("Success: Priority level synced with Firebase!")
            }
            else {
                console.log("ERROR: Unit Test 6 Failed!")
            }
        })
        // console.log("Priority Level in database: " + taskPriority)
        // if (taskPriority === "High"){
        //     console.log("Success: Priority level synced with Firebase!")
        // }
        // else {
        //     console.log("ERROR: Unit Test 6 Failed!")
        // }
        

    }

    sleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
          if ((new Date().getTime() - start) > milliseconds){
            break;
          }
        }
      }

    runUnitTests = () => {
        //UNIT TEST 1
        console.log("Running test 1: Add Task to Project")
        this.createTask()
        this.sleep(10000)

        //UNIT TEST 2
        console.log("Running test 2: Check Task is in database")
        this.checkInDataBase()
        this.sleep(10000)

        //UNIT TEST 3
        console.log("Running test 3: Remove task from database")
        //this.createTask()
        //this.removeTask()
        this.sleep(10000)
       

        //UNIT TEST 4
        // console.log("Running test 4: Sync Estimated Time")
        // //this.createTask()
        // this.sleep(10000)
        // this.findEstimatedTime()
        // //this.removeTask()
        // this.sleep(10000)

        //UNIT TEST 5
        // console.log("Running test 5: Sync Deadline Date")
        // //this.createTask()
        // this.findDeadlineDate()
        // //this.removeTask()
        // this.sleep(10000)

        //UNIT TEST 6
        console.log("Running test 6: Sync Priority Level")
        //this.createTask()
        this.findPriorityLevel()
        //this.removeTask()
        this.sleep(10000)

    }


    // setProjectDashboardState = () =>{

    //     const newState = { ...this.state }
    //     rebase.fetch(`projects/${this.props.match.params.id}`, {
    //         context: this,
    //         then: (data) => {
    //             newState.project = data
    //         }
    //     }).then(() => {
    //         this.bindingref = rebase.syncState(`projects/${this.props.match.params.id}`, {
    //             context: this,
    //             state: 'project',
    //             then: () => {
    //               newState.projectSynced = true
    //               this.setState(newState)
    //             }
    //         })
    //     })

    // }

    render = () => {

        let finalRender

        if (this.state.projectSynced) {

            // let color = "#3CB4CB";
            // let taskKeys = Object.keys(this.state.project.taskList)

            let tasks
            if(!this.state.showArchive){
                if(this.state.project.taskList){
                    const taskKeys = Object.keys(this.state.project.taskList)
                    tasks = (
                        taskKeys.map((key) => {
                            return <Task archived={false} projectID = {this.props.getAppState().currentProject.key}
                            taskKey={key} deleteTaskMethod={this.setProjectDashboardState} getAppState = {this.props.getAppState()}
                            key={key} task={this.state.project.taskList[key]} getProjectDashboardState={this.getProjectDashboardState}
                            setProjectDashboardState={this.setProjectDashboardState} users={this.state.project.userList} />
                        })
                    )
                }
            } else {
                if(this.state.project.archivedTaskList){
                    const taskKeys = Object.keys(this.state.project.archivedTaskList)
                    tasks = (
                        taskKeys.map((key) => {
                        return <Task archived={true} projectID = {this.props.getAppState().currentProject.key} 
                        taskKey={key} deleteTaskMethod={this.setProjectDashboardState} key={key} 
                        task={this.state.project.archivedTaskList[key]} getProjectDashboardState={this.getProjectDashboardState}
                        setProjectDashboardState={this.setProjectDashboardState} users={this.state.project.userList} />
                        })
                    )
                }
            }

            finalRender = (
                <div id="taskDashboard">
                    <ProjectTitleBar setAppState={this.props.setAppState} getAppState={this.props.getAppState} projectColor={this.state.project.projectColor} 
                        getButtonText={this.getButtonText} toggleShowArchive={this.toggleShowArchive} title={this.state.project.projectName} 
                        projectDescription={this.state.project.projectDescription}/>
                    {/* <div id="taskDashContainer">
                    </div> */}
                    <ProjectCollaboratorsBar getAppState={this.props.getAppState} users={this.state.project.userList} color={this.state.project.projectColor} projectID={this.state.project.key}/>
                    <svg height="13" width="100%">
                        <line x1="12" y1="12" x2="98.5%" y2="12" className="projectDivider" style={{stroke:'#C6C6C6',strokeWidth:'1'}} />
                    </svg>
                    <div id="taskDashScrollableContent">
                       
                        {tasks}

                        <div id="addTaskButton" ><NewProjectButton onClick={() => {
                            this.props.goToUrl("/createtask");
                        }} /></div>
                    </div>
                    {/* <button className="unitTestButton" onClick={this.runUnitTests.bind(null,null)}>Run Unit Tests</button> */}

                </div>
            )
        } else {
            finalRender = (
                <div></div>
            )
        }

        return (
            <div id="taskDashboard">{finalRender}</div>
        )
    }

}

export default ProjectDashboard;
