import React, { Component } from 'react'
import rebase from "../rebase.js"
import Task from "./Task.js"
import ProjectTitleBar from "./ProjectTitleBar.js"
import ProjectCollaboratorsBar from "./ProjectCollaboratorsBar.js"
import "./ProjectDashboard.css"
import NewProjectButton from "../ProjectSelectorComps/NewProjectButton.js"
import TodayView from "../TodayView.js"
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const grid = 80;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    // userSelect: 'none',
    // padding: grid * 2,
     //margin: `0 0 ${grid}px 0`,

    // // change background colour if dragging
    // background: isDragging ? 'lightgreen' : 'grey',

    // // styles we need to apply on draggables
    width: isDragging ? '350px' : '100%',
     ...draggableStyle,
  });

  const getListStyle = isDraggingOver => ({
     //background: isDraggingOver ? 'lightblue' : 'lightgrey',
    // padding: grid,
     //padding: 100,
     //width: '100%',
     //height: '515px',
  });



class ProjectDashboard extends Component {

    constructor(props) {
        super(props)
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

    renderTask = (key, archived) => {
        let taskList = this.state.project.taskList
        if (archived) {
            taskList = this.state.project.archivedTaskList
        }
        return <Task archived={archived} tasksCompleted={this.props.getAppState().user.uid.tasksCompleted} displayName={this.props.getAppState().user.displayName} projectID={this.props.getAppState().currentProject.key}
            taskKey={key} deleteTaskMethod={this.setProjectDashboardState} getAppState = {this.props.getAppState()}
            key={key} task={taskList[key]} getProjectDashboardState={this.getProjectDashboardState}
            setProjectDashboardState={this.setProjectDashboardState} users={this.state.project.userList}
            getAppStateFunc={this.props.getAppState} userID={this.props.getAppState().user.uid} />
    }

    render = () => {

        let finalRender
        let taskRender
        let tasks
        let count = 0

        if (this.state.projectSynced) {

            if(!this.state.showArchive){

                if(this.state.project.taskList){

                    let copyTasks = this.state.project.taskList;
                    let copyTasksArray = Object.keys(copyTasks).map(i => copyTasks[i])

                    let filter = this.props.getAppState().user.projects[this.state.project.key].filter
                    if(filter === "Chronological"){
                        console.log("Chronological")
                        const taskKeys = Object.keys(this.state.project.taskList)
                        tasks = (
                            taskKeys.map((key) => {
                                return this.renderTask(key, false)
                            })
                        )
                    } else if(filter === "Default"){ //TODO: smart sorting
                        console.log("Default")
                        const taskKeys = Object.keys(this.state.project.taskList)
                        tasks = (
                            taskKeys.map((key) => {
                                return this.renderTask(key, false)
                            })
                        )
                    } else if(filter === "Due Date"){ //TODO: sort by due date
                        console.log("Due Date")
                        const taskKeys = Object.keys(this.state.project.taskList)
                        tasks = (
                            taskKeys.map((key) => {
                                return this.renderTask(key, false)
                            })
                        )
                    } else if (filter === "Priority") {
                        console.log("PRIORITY")

                        copyTasksArray.sort(
                            function(x, y){
                                if(x.priorityLevel === y.priorityLevel){
                                    return 0;
                                }
                                switch (x.priorityLevel){
                                    case "Low":
                                        return 1
                                    case "High":
                                        return -1
                                    case "Medium":
                                        if(y.priorityLevel === "High"){
                                            return 1
                                        } else {
                                            return -1
                                        }
                                }
                            }
                        )
                        tasks = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            tasks.push(this.renderTask(copyTasksArray[i].key, false))
                        }
                    } else if (filter === "Time to Complete (Ascending)"){
                        console.log("TIME ASCENDING")
                        copyTasksArray.sort(
                            function(x, y){
                                if(x.EstimatedTimeValue === y.EstimatedTimeValue){
                                    return 0
                                } else if(x.EstimatedTimeValue < y.EstimatedTimeValue){
                                    return -1
                                } else {
                                    return 1
                                }
                            }
                        )
                        tasks = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            tasks.push(this.renderTask(copyTasksArray[i].key, false))
                        }
                    } else if (filter === "Time to Complete (Descending)"){
                        console.log("TIME DESCENDING")
                        copyTasksArray.sort(
                            function(x, y){
                                if(x.EstimatedTimeValue === y.EstimatedTimeValue){
                                    return 0
                                } else if(x.EstimatedTimeValue < y.EstimatedTimeValue){
                                    return 1
                                } else {
                                    return -1
                                }
                            }
                        )
                        tasks = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            tasks.push(this.renderTask(copyTasksArray[i].key, false))
                        }
                    } else { //Filter by a category
                        console.log("OTHER")
                        tasks = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            // if(copyTasksArray[i].taskCategory === filter){
                                tasks.push(this.renderTask(copyTasksArray[i].key, false))
                            // }
                        }
                    }

                taskRender = (
                    <Droppable droppableId="TaskContainer">

                  {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>


                  {Object.keys(this.state.project.taskList).map((item, index) => (
                //  {tasks.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index} name={tasks[index].props.task.taskName} description={tasks[index].props.task.taskDescription }>
                      {(provided, snapshot) => (
                      <div>
                      <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                           snapshot.isDragging,
                              provided.draggableProps.style
                          )}
                          >
                          {tasks[index]}
                          </div>
                          {provided.placeholder}
                      </div>
                      )}
                  </Draggable>
                  ))}
                  {provided.placeholder}
              </div>
              )}
                   </Droppable>


              )

                 }
            } else {
                if(this.state.project.archivedTaskList){
                    // const taskKeys = Object.keys(this.state.project.archivedTaskList)

                    // taskRender = (
                    //     taskKeys.map((key) => {
                    //         return this.renderTask(key, true)
                    //     // return <Task archived={true} tasksCompleted={this.props.getAppState().user.uid.tasksCompleted} projectID = {this.props.getAppState().currentProject.key} displayName={this.props.getAppState().user.displayName} userID={this.props.getAppState().user.uid}
                    //     // taskKey={key} deleteTaskMethod={this.setProjectDashboardState} key={key}
                    //     // task={this.state.project.archivedTaskList[key]} getProjectDashboardState={this.getProjectDashboardState}
                    //     // setProjectDashboardState={this.setProjectDashboardState}/>
                    //     })
                    // )

                    let copyTasks = this.state.project.archivedTaskList;
                    let copyTasksArray = Object.keys(copyTasks).map(i => copyTasks[i])

                    let filter = this.props.getAppState().user.projects[this.state.project.key].filter
                    if(filter === "Chronological"){
                        console.log("Chronological")
                        const taskKeys = Object.keys(this.state.project.archivedTaskList)
                        taskRender = (
                            taskKeys.map((key) => {
                                return this.renderTask(key, true)
                            })
                        )
                    } else if(filter === "Default"){ //TODO: smart sorting
                        console.log("Default")
                        const taskKeys = Object.keys(this.state.project.archivedTaskList)
                        taskRender = (
                            taskKeys.map((key) => {
                                return this.renderTask(key, true)
                            })
                        )
                    } else if(filter === "Due Date"){ //TODO: sort by due date
                        console.log("Due Date")
                        const taskKeys = Object.keys(this.state.project.archivedTaskList)
                        taskRender = (
                            taskKeys.map((key) => {
                                return this.renderTask(key, true)
                            })
                        )
                    } else if (filter === "Priority") {
                        console.log("PRIORITY")

                        copyTasksArray.sort(
                            function(x, y){
                                if(x.priorityLevel === y.priorityLevel){
                                    return 0;
                                }
                                switch (x.priorityLevel){
                                    case "Low":
                                        return 1
                                    case "High":
                                        return -1
                                    case "Medium":
                                        if(y.priorityLevel === "High"){
                                            return 1
                                        } else {
                                            return -1
                                        }
                                }
                            }
                        )
                        taskRender = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            taskRender.push(this.renderTask(copyTasksArray[i].key, true))
                        }
                    } else if (filter === "Time to Complete (Ascending)"){
                        console.log("TIME ASCENDING")
                        copyTasksArray.sort(
                            function(x, y){
                                if(x.EstimatedTimeValue === y.EstimatedTimeValue){
                                    return 0
                                } else if(x.EstimatedTimeValue < y.EstimatedTimeValue){
                                    return -1
                                } else {
                                    return 1
                                }
                            }
                        )
                        taskRender = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            taskRender.push(this.renderTask(copyTasksArray[i].key, true))
                        }
                    } else if (filter === "Time to Complete (Descending)"){
                        console.log("TIME DESCENDING")
                        copyTasksArray.sort(
                            function(x, y){
                                if(x.EstimatedTimeValue === y.EstimatedTimeValue){
                                    return 0
                                } else if(x.EstimatedTimeValue < y.EstimatedTimeValue){
                                    return 1
                                } else {
                                    return -1
                                }
                            }
                        )
                        taskRender = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            taskRender.push(this.renderTask(copyTasksArray[i].key, true))
                        }
                    } else { //Filter by a category
                        console.log("OTHER")
                        taskRender = []
                        for(var i = 0; i < copyTasksArray.length; i++){
                            // if(copyTasksArray[i].taskCategory === filter){
                                taskRender.push(this.renderTask(copyTasksArray[i].key, true))
                            // }
                        }
                    }
                }
            }


            finalRender = (


                <div id="taskDashboard">
                    <ProjectTitleBar setAppState={this.props.setAppState} getAppState={this.props.getAppState} project={this.state.project} projectColor={this.state.project.projectColor}
                        getButtonText={this.getButtonText} toggleShowArchive={this.toggleShowArchive} title={this.state.project.projectName}
                        projectDescription={this.state.project.projectDescription} getProjectDashboardState={this.getProjectDashboardState}
                        setProjectDashboardState={this.setProjectDashboardState} goToUrl={this.props.goToUrl}/>


                    {/* <div id="taskDashContainer">
                    </div> */}
                    <ProjectCollaboratorsBar getAppState={this.props.getAppState} users={this.state.project.userList} color={this.state.project.projectColor}
                    projectID={this.state.project.key} project={this.state.project} title={this.state.project.projectName} events={this.state.project.events}/>
                
                    <div id="taskDashScrollableContent">

                        {taskRender}

                        <div id="addTaskButton" style={{'position': 'fixed', bottom: '0px', width: '100%', paddingBottom: '15px'}}><NewProjectButton onClick={() => {
                            this.props.goToUrl("/createtask");
                        }} /></div>
                    </div>
                </div>
            )
        } else {
            finalRender = (


                <div></div>
            )
            taskRender = (
                <div></div>

            )
        }
        return (
            <div>
                    <div id="taskDashboard">{finalRender}
                    </div>
            </div>
        )
    }
}

export default ProjectDashboard;
