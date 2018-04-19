import React, { Component } from 'react'
import rebase from "../rebase.js"
import ContentEditable from 'react-contenteditable'
import "./Task.css"
import 'react-responsive-modal/lib/react-responsive-modal.css';
import UserIcon from "./UserIcon.js"
import AddUserButton from "./AddUserButton.js"
import TaskComment from "./TaskComment.js"
import funnytemp from "../images/temp.jpg"
import "./TaskComment.css"
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Modal from 'react-responsive-modal/lib/css';
import { validateDate } from "../apphelpers.js"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { App } from "../App.js"
import lockIcon from "../images/Icons/Lock.svg"


class Task extends Component {

    constructor() {
        super();

        this.state = {
            open: false,
            visible: 'hidden',
            description: 'I am a very descriptive description!',
            taskID: "",
            archived: false,
            color: '#3CB4CB',
            editedDate: false,
            addUserOpen: false,
            commentValue: "",
            addedComment: false,
            commentsSynced: false,
            edited: "",
            taskComments: {

            },
            isManager: false,
            tempTitle: "",
            tempDescription: "",
            tempPriority: "",
            tempDate: "",
            tempHours: "",
            changeErrorMessage: ""
        }
      super();

      this.state = {
           open: false,
           visible: 'hidden',
           description: 'I am a very descriptive description!',
           taskID: "",
           archived: false,
           color: '#3CB4CB',
           editedDate: false,
           addUserOpen: false,
           commentValue: "",
           addedComment: false,
           commentsSynced: false,
           edited: "",
           locked: "", 
           taskComments: {

           },
           isManager: false,
           tempTitle: "",
           tempDescription: "",
           tempPriority: "",
           tempDate: "",
           tempHours: "",
           changeErrorMessage: ""
       }
       console.log(this.state.locked)
    }

    componentWillMount = () => {
        const newState = { ...this.state }
        newState.isManager = !(this.props.getProjectDashboardState().project.managerList[this.props.getAppStateFunc().user.uid] == undefined)
        newState.tempTitle = this.props.task.taskName
        newState.tempDescription = this.props.task.taskDescription
        newState.tempPriority = this.props.task.priorityLevel
        newState.tempHours = this.props.task.EstimatedTimeValue
        newState.tempDate = this.props.task.deadline
        newState.taskCategory = this.props.task.taskCategory
        let arch = this.props.archived
        rebase.fetch(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/`, {
            context: this,
            asArray: true,
            then(data){
              console.log(data);
              if (data.locked){
                  newState.locked = data.locked
              }
              else {
                  newState.locked = false
              }
            }
          });


        if(arch){
            rebase.fetch(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments`, {
                context: this,
                then: (data) => {
                    newState.taskComments = data
                }
            }).then(() => {
                this.bindingref = rebase.syncState(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments`, {
                    context: this,
                    state: 'taskComments',
                    then: () => {
                        newState.commentsSynced = true
                        this.setState(newState)
                    }
                })
            })
        } else {
            rebase.fetch(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments`, {
                context: this,
                then: (data) => {
                    newState.taskComments = data
                }
            }).then(() => {
                this.bindingref = rebase.syncState(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments`, {
                    context: this,
                    state: 'taskComments',
                    then: () => {
                        newState.commentsSynced = true
                        this.setState(newState)
                    }
                })
            })
        }
    }

    componentWillUnmount = () => {
        this.setState({
            commentsSynced: false
        })
    }

    switch = () => {
        if (this.state.open){
            // Do stuff with values
            console.log(this.state)
            const titleValid = this.state.tempTitle !== " "
            const descValid = this.state.tempDate !== " "
            const priorValid = this.state.tempPriority === "High" || this.state.tempPriority === "Medium" || this.state.tempPriority === "Low"
            const dateValid = validateDate(this.state.tempDate)
            const hoursValid = !isNaN(this.state.tempHours) && this.state.temoHours !== " "
            if (!titleValid) {
                this.setState({changeErrorMessage: "Please enter a title..."})
                return;
            }
            if (!descValid) {
                this.setState({changeErrorMessage: "Please enter a description..."})
                return;
            }
            if (!priorValid) {
                this.setState({changeErrorMessage: "Please make the priority 'High', 'Medium', or 'Low'..."})
                return;
            }
            if (!dateValid) {
                this.setState({changeErrorMessage: "Please enter a date in the form MM//DD/YYYY..."})
                return;
            }
            if (!hoursValid) {
                this.setState({changeErrorMessage: "Please enter a valid number for hours left..."})
                return;
            }
            const newState = this.props.getProjectDashboardState()
            let taskList = newState.project.taskList
            if (this.props.archived) {
                taskList = newState.project.archivedTaskList
            }

            if (!taskList[this.props.taskKey].descriptionLocked && this.state.isManager && this.state.tempDescription != this.props.task.taskDescription) {
                this.postCommentForManagerEdit("Description value has been locked by a manager...")
                taskList[this.props.taskKey].descriptionLocked = true
            }
            if (!taskList[this.props.taskKey].titleLocked && this.state.isManager && this.state.tempTitle != this.props.task.taskName) {
                this.postCommentForManagerEdit("Title value has been locked by a manager...")
                taskList[this.props.taskKey].titleLocked = true
            }
            if (!taskList[this.props.taskKey].priorityLocked && this.state.isManager && this.state.tempPriority != this.props.task.priorityLevel) {
                this.postCommentForManagerEdit("Priority has been locked by a manager...")
                taskList[this.props.taskKey].priorityLocked = true
            }
            if (!taskList[this.props.taskKey].hoursLocked && this.state.isManager && this.state.tempHours != this.props.task.EstimatedTimeValue) {
                this.postCommentForManagerEdit("Hours has been locked by a manager...")
                taskList[this.props.taskKey].hoursLocked = true
            }
            if (!taskList[this.props.taskKey].dateLocked && this.state.isManager && this.state.tempDate != this.props.task.deadline) {
                this.postCommentForManagerEdit("Deadline has been locked by a manager...")
                taskList[this.props.taskKey].dateLocked = true
            }
            taskList[this.props.taskKey].taskName = this.state.tempTitle
            taskList[this.props.taskKey].priorityLevel = this.state.tempPriority
            taskList[this.props.taskKey].EstimatedTimeValue = this.state.tempHours
            taskList[this.props.taskKey].taskDescription = this.state.tempDescription
            taskList[this.props.taskKey].deadline = this.state.tempDate
            this.props.setProjectDashboardState(newState);
            this.setState({ open: false, visible: 'hidden', changeErrorMessage: "" });

            //delete comment



            if(this.props.archived){

                rebase.fetch(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments/`, {
                    context: this,
                    asArray: true,
                    then(data){
                        console.log(data);
                        data.map((tasks,i) => {
                            console.log(tasks)
                            if (tasks.text.length <= 1){
                                //     console.log(tasks)
                                //remove comment
                                const key = tasks.key

                                rebase.remove(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments/${key}`, function(err){

                                });

                            }
                        }

                    )
                    //   )}
                }
            })

            //rebase.remove(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments/${this.props.commentID}`)

        }else {
            //rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments/${this.props.commentID}`)
            rebase.fetch(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments/`, {
                context: this,
                asArray: true,
                then(data){
                    console.log(data);
                    data.map((tasks,i) => {
                        console.log(tasks)
                        if (tasks.text.length <= 1){
                            //     console.log(tasks)
                            //remove comment
                            const key = tasks.key

                            rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments/${key}`, function(err){

                            });

                        }
                    }

                )
                //   )}
            }
        })
    }


} else {
    this.setState({ open: true, visible: 'visible' });
}
};

css = () => {
    if (this.state.open) {
        /* CSS for larger task stuff */
        return ({
            height: 'auto',
            backgroundColor: 'white',
            boxShadow: '0px 0px 3px lightgrey',
            marginTop: '5px',
            marginBottom: '5px'
        })
    } else {
        return ({height: '40px', backgroundColor: '#F8F8F8'})
    }
}

testFunction = () => {
    var response = window.confirm("Are you sure you want to delete this task?")
    if (response == true){
        if (!this.props.archived){
            console.log(this.props)

            rebase.fetch(`users/${this.props.userID}/todayView`, {
                context: this,
            }).then(data => {
                console.log(data)
                let taskArray = Object.keys(data);
                console.log(taskArray)
                for (var i = 0; i < taskArray.length;i++ ){
                    let tid = taskArray[i];

                    rebase.fetch(`users/${this.props.userID}/todayView/${tid}`, {
                        context: this,
                    }).then(data => {
                        console.log(data)
                        console.log(this.props.taskKey)
                        if (data.taskIDNumber === this.props.taskKey){
                            console.log(taskArray[i])
                            rebase.remove(`users/${this.props.userID}/todayView/${tid}`, function(err){
                                if(!err){
                                    console.log("fiddlesticks")
                                }
                            });
                        }

                        rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}`, function(err){
                            if(!err){
                                console.log("fiddlesticks")

                            }
                        });
                    })
                }
            })

            rebase.remove(`projects/${this.props.projectID}/taskList/${this.props.taskKey}`, function(err){
                if(!err){
                    console.log("fiddlesticks")

                }
            });


        } else {
            rebase.remove(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}`, function(err){
                if(err){
                    console.log("fiddlesticks")
                }
            });
        }

    }
}

checkIsVisible = () => {
    if (this.props.archived){
        return ({
            visibility: 'visible',
            stroke: 'white'
        })
    } else {
        return ({
            visibility: 'hidden'
        })
    }
}

checkRectIsArchived = () => {
    if (this.props.archived){
        return ({
            visibility: 'visible',
            borderWidth: '0px',
            fill: '#3CB4CB'
        })
    } else {
        return ({
            fill: 'transparent',

        })
    }
}

//Ian: Archive the task if it's archived. Unarchive it if it's not.
toggleArchived = () => {
    if (this.props.archived){
        //Unarchive
        const projID = this.props.projectID;
        const taskID = this.props.taskKey;
        var totalHours = this.props.getProjectDashboardState().project.archivedTaskList[taskID].EstimatedTimeValue
        rebase.fetch(`users/${this.props.userID}`, {
            then: (data) => {
                rebase.update(`users/${this.props.userID}`, {
                    data: { taskCompleted: data.taskCompleted-1 }
                })
            }
        })
        rebase.fetch(`users/${this.props.userID}`, {
            then: (data) => {
                rebase.update(`users/${this.props.userID}`, {
                    data: { allTimeHours: data.allTimeHours - +totalHours }
                })
            }
        })

        var now = new Date()
        var split = this.props.task.deadline.split("/")
        var onTime = false
        if (split[2] == now.getFullYear()){
            if (split[0] > now.getMonth()+1) {
                onTime = true;
            }
            else if (split[0] == now.getMonth()+1) {
                if (split[1] >= now.getDate()){
                    onTime = true;
                }
            }
        }
        else if (split[2] > now.getFullYear()) {
            onTime = true;
        }
        if (onTime) {
            rebase.fetch(`users/${this.props.userID}`, {
                then: (data) => {
                    rebase.update(`users/${this.props.userID}`, {
                        data: { onTimeTasks: data.onTimeTasks-1 }
                    })
                }
            })
        }

        rebase.fetch(`projects/${projID}/archivedTaskList/${taskID}`, {
            context: this,
            then(taskData){
                //console.log(taskID);
                rebase.post(`projects/${projID}/taskList/${taskID}`, {
                    data: taskData,
                    then(err){
                        //Thanks Alex
                        rebase.remove(`projects/${projID}/archivedTaskList/${taskID}`, function(err){
                            if(err){
                                console.log("fickstiddles")
                            }
                        });

                    }
                })

            }
        })

        //complete the task in the todayView component
        rebase.fetch(`users/${this.props.userID}/todayView`, {
            context: this,
        }).then(data => {
            console.log(data)
            let taskArray = Object.keys(data);
            console.log(taskArray)
            for (var i = 0; i < taskArray.length;i++ ){
                let tid = taskArray[i];


                rebase.fetch(`users/${this.props.userID}/todayView/${tid}`, {
                    context: this,
                }).then(data => {
                    console.log(data)
                    console.log(this.props.taskKey)
                    if (data.taskIDNumber === taskID){
                        console.log(taskArray[i])
                        console.log(taskID)

                        rebase.update(`users/${this.props.userID}/todayView/${tid}`, {
                            data: {completed: true},
                            then(err){
                                if(!err){
                                    console.log("Oh No 23436")
                                }
                            }
                        });
                    }
                })
            }
        })

        //uncomplete the task in the todayView component
        rebase.fetch(`users/${this.props.userID}/todayView`, {
            context: this,
        }).then(data => {
            console.log(data)
            let taskArray = Object.keys(data);
            console.log(taskArray)
            for (var i = 0; i < taskArray.length;i++ ){
                let tid = taskArray[i];


                rebase.fetch(`users/${this.props.userID}/todayView/${tid}`, {
                    context: this,
                }).then(data => {
                    console.log(data)
                    console.log(this.props.taskKey)
                    if (data.taskIDNumber === taskID){
                        console.log(taskArray[i])
                        console.log(taskID)

                        rebase.update(`users/${this.props.userID}/todayView/${tid}`, {
                            data: {completed: false},
                            then(err){
                                if(!err){
                                    console.log("Oh No 23436")
                                }
                            }
                        });
                    }
                })
            }
        })
    } else {
        // Archive
        const projID = this.props.projectID;
        const taskID = this.props.taskKey;
        var totalHours = this.props.getProjectDashboardState().project.taskList[taskID].EstimatedTimeValue
        console.log(taskID);
        rebase.fetch(`users/${this.props.userID}`, {
            then: (data) => {
                rebase.update(`users/${this.props.userID}`, {
                    data: { taskCompleted: data.taskCompleted+1 }
                })
            }
        })
        rebase.fetch(`users/${this.props.userID}`, {
            then: (data) => {
                rebase.update(`users/${this.props.userID}`, {
                    data: { allTimeHours: data.allTimeHours + +totalHours }
                })
            }
        })

        var now = new Date()
        var split = this.props.task.deadline.split("/")
        var onTime = false
        // console.log(split[2])
        // console.log(split[0])
        // console.log(split[1])
        // console.log(now.getFullYear())
        // console.log(now.getMonth()+1)
        // console.log(now.getDate())
        if (split[2] == now.getFullYear()){
            if (split[0] > now.getMonth()+1) {
                onTime = true;
            }
            else if (split[0] == now.getMonth()+1) {
                if (split[1] >= now.getDate()){
                    onTime = true;
                }
            }
        }
        else if (split[2] > now.getFullYear()) {
            onTime = true;
        }
        if (onTime) {
            rebase.fetch(`users/${this.props.userID}`, {
                then: (data) => {
                    rebase.update(`users/${this.props.userID}`, {
                        data: { onTimeTasks: data.onTimeTasks+1 }
                    })
                }
            })
        }

        rebase.fetch(`projects/${projID}/taskList/${taskID}`, {
            context: this,
            then(taskData){
                //console.log(taskID);
                rebase.post(`projects/${projID}/archivedTaskList/${taskID}`, {
                    data: taskData,
                    then(err){
                        //Thanks Alex
                        rebase.remove(`projects/${projID}/taskList/${taskID}`, function(err){
                            if(err){
                                console.log("stickfiddles")
                            }
                        });
                    }
                })
            }
        })

        var now = new Date()
        rebase.fetch(`projects/${projID}/taskList/${taskID}`, {
            context: this,
            then(taskData){
                rebase.push(`projects/${projID}/events`, {
                    data: {
                        event: " completed task " + "\"" + taskData.taskName + "\"",
                        timestamp: now.getMonth()+1 + "/" + now.getDate() + "/" + now.getFullYear(),
                        useid: this.props.displayName
                    }
                })
            }
        })



        //complete the task in the todayView component
        rebase.fetch(`users/${this.props.userID}/todayView`, {
            context: this,
        }).then(data => {
            console.log(data)
            let taskArray = Object.keys(data);
            console.log(taskArray)
            for (var i = 0; i < taskArray.length;i++ ){
                let tid = taskArray[i];


                rebase.fetch(`users/${this.props.userID}/todayView/${tid}`, {
                    context: this,
                }).then(data => {
                    console.log(data)
                    console.log(this.props.taskKey)
                    if (data.taskIDNumber === taskID){
                        console.log(taskArray[i])
                        console.log(taskID)

                        rebase.update(`users/${this.props.userID}/todayView/${tid}`, {
                            data: {completed: true},
                            then(err){
                                if(!err){
                                    console.log("Oh No 23436")
                                }
                            }
                        });
                    }
                })
            }
        })
    }
}

/*
This currently only is the box. It needs the following:
1) Get the color for the project from Firebase
2) Some way of knowing if it's currently selected
3) If it's selected, stay expanded to the square
4) If it's selected, have the box show on the side
*/

/* style={{visibility: this.state.visible}} */


changeTaskName = (event) => {

    const myNewState = { ...this.state }
    let thing = event.target.value
    if (thing === "") {
        thing = "Task title"
    }
    myNewState.tempTitle = thing
    this.setState(myNewState)
}

changeDeadline = (event) => {

    const myNewState = { ...this.state }
    let thing = event.target.value
    if (thing === "") {
        thing = "MM/DD/YY"
    }
    myNewState.tempDate = thing
    this.setState(myNewState)

}

changeTaskDescription = (event) => {
    const myNewState = { ...this.state }
    let thing = event.target.value
    if (thing === "") {
        thing = "Task description"
    }
    myNewState.tempDescription = thing
    this.setState(myNewState)
}
changePriorityLevel = (event) => {
    const myNewState = { ...this.state }
    let thing = event.target.value
    if (thing === "") {
        thing = "High"
    }
    myNewState.tempPriority = thing
    this.setState(myNewState)
}

changeEstimatedTimeValue = (event) => {
    let hours;
    if (event.target.value > 9){
        const myNewState = { ...this.state }
        let thing = 9
        if (thing === "") {
            thing = " "
        }
        myNewState.tempHours = thing
        this.setState(myNewState)
        hours = thing

    }
    else {
        const myNewState = { ...this.state }
        let thing = Math.round(event.target.value)
        if (thing === "") {
            thing = " "
        }
        myNewState.tempHours = thing
        this.setState(myNewState)
        hours = thing
    }

    console.log(this.props.taskKey)
    //check everything in the todayView to see if sizes are correct still
    const ID = this.props.getAppState.user.uid
    rebase.fetch(`users/${ID}/todayView/`, {
        context: this,
        asArray: true,
        then(data){
            console.log(data);
            var tasks = (Object.values(data))
            var taskArray = (Object.keys(data))
            console.log(tasks)
            for (var i = 0; i < tasks.length;i++ ){
                let tid = tasks[i].key;
                console.log(tasks)
                console.log(tid)

                rebase.fetch(`users/${ID}/todayView/${tid}`, {
                    context: this,
                }).then(data1 => {
                    console.log(data1)
                    console.log(this.props.taskKey)
                    console.log(data1.taskIDNumber)
                    if (data1.taskIDNumber === this.props.taskKey){
                        console.log(tid)
                        //update the estimated time field
                        console.log(hours)
                        rebase.update(`users/${ID}/todayView/${tid}/`, {
                            data: {EstimatedTimeValue: hours}
                        });
                    }
                })
            }
        }
    });
}

//push comment to fireBase
postCommentForManagerEdit = (text) => {
    const projectID = this.props.projectID
    const usID = this.props.getAppState.user.uid
    const tID = this.props.taskKey
    const comment = text
    const uname = this.props.getAppState.user.displayName
    const img = this.props.getAppState.user.photoURL
    var today = new Date();
    if(this.props.archived){
        rebase.push(`projects/${projectID}/archivedTaskList/${tID}/taskComments`, {
            data: {
                uid: [usID],
                text: comment,
                username: uname,
                image: img,
                timestamp: today.getDate()
            }
        });
    }else {
        rebase.push(`projects/${projectID}/taskList/${tID}/taskComments`, {
            data: {
                uid: [usID],
                text: comment,
                username: uname,
                image: img,
                timestamp: today.getTime()
            }
        });
    }

    this.setState({addedComment: true})
    this.clearComment()
}

//push comment to fireBase
postComment = () => {
    const projectID = this.props.projectID
    const usID = this.props.getAppState.user.uid
    const tID = this.props.taskKey
    const comment = this.state.commentValue
    const uname = this.props.getAppState.user.displayName
    const img = this.props.getAppState.user.photoURL
    var today = new Date();
    if(this.props.archived){
        rebase.push(`projects/${projectID}/archivedTaskList/${tID}/taskComments`, {
            data: {
                uid: [usID],
                text: comment,
                username: uname,
                image: img,
                timestamp: today.getTime()
            }
        });
    }else {
        rebase.push(`projects/${projectID}/taskList/${tID}/taskComments`, {
            data: {
                uid: [usID],
                text: comment,
                username: uname,
                image: img,
                timestamp: today.getTime()
            }
        });
    }

    this.setState({addedComment: true})
    this.clearComment()
}

sendComment = (event) => {
    const newState = { ...this.state }
    newState.commentValue = event.target.value
    this.setState(newState)
}

clearComment = () => {
    const newState = { ...this.state }
    newState.commentValue = ''
    this.setState(newState)
}

getDaysLeft = () => {
    let fixedDeadline = this.props.task.deadline
    fixedDeadline = this.state.tempDate
    if (this.state.open){
        return this.state.tempDate
        return this.props.task.deadline;
    }
    // MM/DD/YY
    const dueDate = fixedDeadline.split("/");
    const year = dueDate[2];
    let month = dueDate[0];
    let day = dueDate[1]
    day = parseInt(day) + 1
    month = month - 1

    moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s ago",
            s  : 'a few seconds',
            ss : '%d seconds',
            m:  "a minute",
            mm: "%d minutes",
            h:  "an hour",
            hh: "%d hours",
            d:  "a day",
            dd: "%d days",
            M:  "a month",
            MM: "%d months",
            y:  "a year",
            yy: "%d years"

    askManagerForApproval = () => {

        rebase.fetch(`projects/${this.props.projectID}/`, {
            context: this,
            
            then(data){
              console.log(data);
              const notification = {
                type: "approval",
                projectName: data.projectName,
                projectColor: data.projectColor,
                projectPhotoURL: data.projectPhotoURL,
                projectDescription: data.projectDescription,
                key: this.props.projectID,
                taskAlertTime: 0,
                taskID: this.props.taskKey,
                taskName: this.state.tempTitle,
                taskDescription: this.state.tempDescription
            }

            rebase.fetch(`projects/${this.props.projectID}/managerList`, {
                context: this,
                //asArray: true,
                then(data){
                  console.log(data);
                  let arr = Object.keys(data)
                  console.log(arr)
                  console.log(this.props.projectID)
                    arr.map((user) => {
                        console.log(user)
                        console.log(notification)
                        rebase.update(`users/${user}/notifications/${this.props.projectID}`, {
                            data: notification
                        })
                    })
                }
              });
            }
          });
    }

    unlockTask = () => {
        //this.setState({locked: false})
                rebase.update(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/`, {
                    data: {
                        locked: false
                    }
                });
    }

    lockTask = () => {
        // const newState = { ...this.state }
        // newState.locked = true;
        // this.setState(newState)
        //this.setState({locked: true})
                rebase.update(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/`, {
                    data: {
                        locked: true
                    }
                });
    }

    


    lockTaskIfManager = () => {
        const projectID = this.props.projectID
        const tID = this.props.taskKey

        if (this.state.isManager){
            //lock/unlock the task
            var response = window.confirm("Select Ok to Complete task, Cancel to lock it")
            if (response){
                this.toggleArchived()
            } else {

                if (this.state.locked){
                    console.log("unlocking")
                    this.unlockTask()
                    this.toggleArchived()
                }
                else {
                    console.log("locking")
                    this.lockTask()
                    console.log(this.state.locked)
                }
            }
        }
        else {

            rebase.fetch(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/`, {
                context: this,
                then(data){
                  console.log(data);
                  if (data.locked){
                    //task is locked, so send a notification to a manager asking to approve it
                    console.log("asking")
                    this.askManagerForApproval()
                }
                else {
                    //task is not locked so proceed like usual
                    console.log("usual")
                        this.toggleArchived()
                }

                }
              });
            //check if it is locked already by a manager
            console.log(this.state.locked)
            // if (this.state.locked){
            //     //task is locked, so send a notification to a manager asking to approve it
            //     console.log("asking")
            //     this.askManagerForApproval()
            // }
            // else {
            //     //task is not locked so proceed like usual
            //     console.log("usual")
            //         this.toggleArchived()
            // }
        }
    }

    assignTask = (key) => {
        const dashboardState = { ...this.props.getProjectDashboardState() }
        if (key === null) {
            dashboardState.project.taskList[this.props.taskKey].assignedTo = undefined
        } else {
            dashboardState.project.taskList[this.props.taskKey].assignedTo = key
            this.props.setProjectDashboardState(dashboardState)
        }
    });

    const banana = moment([year, month, day]).fromNow();
    return banana
}

assignTask = (key) => {
    const dashboardState = { ...this.props.getProjectDashboardState() }
    if (key === null) {
        dashboardState.project.taskList[this.props.taskKey].assignedTo = undefined
    } else {
        dashboardState.project.taskList[this.props.taskKey].assignedTo = key
        this.props.setProjectDashboardState(dashboardState)
    }
    this.sendAssignmentNotification(key)
    this.setState({addUserOpen: false})
}

sendAssignmentNotification = (id) => {
    const notification = {
        type: "assignment",
        projectName: this.props.getProjectDashboardState().project.projectName,
        projectColor: this.props.getProjectDashboardState().project.projectColor,
        projectPhotoURL: this.props.getProjectDashboardState().project.projectPhotoURL,
        taskName: this.props.task.taskName
    }
    rebase.update(`users/${id}/notifications/${this.props.taskKey}`, {
        data: notification
    })
}

render = () => {

    let userKeys
    if (this.props.users) {
        userKeys = Object.keys(this.props.users)
    }

    let isManager = !(this.props.getProjectDashboardState().project.managerList[this.props.getAppStateFunc().user.uid] == undefined)


    let assignedTo
    if (this.props.task.assignedTo) {
        console.log(this.props.task.assignedTo)
        assignedTo = (
            <UserIcon color={this.props.getProjectDashboardState().project.projectColor} getAppState={this.props.getAppStateFunc}
                user={this.props.users[this.props.task.assignedTo]} userID={this.props.task.assignedTo}
                project={this.props.getProjectDashboardState().project} projectID={this.props.getProjectDashboardState().project.key} />
        )
    }

    let assignButton
    if (this.state.isManager) {
        assignButton = (
            <AddUserButton onClick={() => {
                    this.setState({addUserOpen: true})
                }}/>
            )
        }

        let taskComments
        let finalRender

        if(this.state.commentsSynced){
            if(this.state.taskComments){
                const commentKeys = Object.keys(this.state.taskComments)
                taskComments = (
                    commentKeys.map((key) => {
                        let del = false;
                        if(this.props.getAppState.user.uid == this.state.taskComments[key].uid){
                            del = true;
                        }
                        const userKey = this.state.taskComments[key].uid[0]
                        return <TaskComment username={this.state.taskComments[key].username} uid={this.state.taskComments[key].uid[0]}
                            commentValue={this.state.taskComments[key].text} key={key} image={this.state.taskComments[key].image}
                            showDelete={del} taskKey={this.props.taskKey} projectID={this.props.projectID} commentID={key} archived={this.props.archived}
                            user={this.props.users[userKey]} userID={userKey} project={this.props.getProjectDashboardState().project}
                            getProjectDashboardState={this.props.getProjectDashboardState} setProjectDashboardState={this.props.setProjectDashboardState}
                            getAppState={this.props.getAppStateFunc} timestamp={this.state.taskComments[key].timestamp} edited={this.state.taskComments[key].edited}/>
                    })
                )
            }

            finalRender = (
                <div onClick={() => {
                        if (!this.state.open) {
                            this.switch()
                        }
                    }} >
                    <div id="task" style={this.css()}>
                        <div id="taskStats">
                            <div id="taskCheckAndTitle">
                                <svg height="30" width="30">
                                    <title>Lock</title>
                                    <desc>Created with Sketch.</desc>
                                    <defs></defs>
                                    <g id="Reiterate-on-Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g id="Desktop" transform="translate(0, 0)" stroke="#979797">
                                            <g id="Lock" transform="translate(6, 13)">
                                                <path d="M5.5,7.5 L5.5,9.5" id="Line-4" stroke-linecap="square"></path>
                                                <rect id="Rectangle-12" x="0.5" y="4.5" width="10" height="8" rx="2"></rect>
                                                <path d="M2,5 L2,3.5 L2,3.5 C2,1.56700338 3.56700338,3.55085719e-16 5.5,0 L5.5,0 L5.5,0 C7.43299662,-3.55085719e-16 9,1.56700338 9,3.5 L9,5" id="Path-2"></path>
                                            </g>
                                        </g>
                                    </g>
                                    <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox" style={this.checkRectIsArchived()} onClick={this.toggleArchived}/>
                                    <line x1="5" x2="10" y1="19" y2="25" style={this.checkIsVisible()} className="checkBox" />
                                    <line x1="10" x2="17" y1="25" y2="13" style={this.checkIsVisible()} className="checkBox" />
                                </svg>
                                <p id="taskTitle" className="text_task"><ContentEditable disabled={this.props.task.titleLocked && !this.state.isManager} onChange={this.changeTaskName} html={this.state.tempTitle}/></p>
                            </div>
                                </g>
                                 <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox" style={this.checkRectIsArchived()} onClick={this.lockTaskIfManager}/>
                                 <line x1="5" x2="10" y1="19" y2="25" style={this.checkIsVisible()} className="checkBox" />
                                 <line x1="10" x2="17" y1="25" y2="13" style={this.checkIsVisible()} className="checkBox" />
                            </svg>
                            <h4 id="taskTitle"><ContentEditable disabled={this.props.task.titleLocked && !this.state.isManager} onChange={this.changeTaskName} html={this.state.tempTitle}/></h4>
                        </div>
                        {/* @Zach pls halp */}
                        <h5>{this.state.taskCategory}</h5>
                        <div id="taskContentInfo" style={{right: '12px'}}><b><ContentEditable disabled = {this.props.task.priorityLocked && !this.state.isManager} onChange = {this.changePriorityLevel} html={this.state.tempPriority}/></b> | <ContentEditable disabled = {this.props.task.hoursLocked && !this.state.isManager} onChange={this.changeEstimatedTimeValue} html={(this.state.tempHours)}/> {" hrs"} | <ContentEditable disabled={this.props.task.dateLocked && !this.state.isManager} onChange={this.changeDeadline} html={this.getDaysLeft()}/> </ div>
                    </div>
                    <div style={{visibility: this.state.visible}} id="taskInfo">
                        <p id="taskDescription"><ContentEditable disabled={this.props.task.descriptionLocked && !this.state.isManager} onChange={this.changeTaskDescription}
                        html={this.state.tempDescription} /> </p>
                            <div id="taskUsers">
                                {assignedTo}
                                {assignButton}
                                <Modal open={this.state.addUserOpen} onClose={() => this.setState({addUserOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'assignUserModal'}}>
                                    <div>
                                        {/* <h1 className="taskAssignment">Task assignment</h1>*/}
                                        <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Select users to assign to this task</h4>
                                        <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '350px', "overflow": "scrollable"}}>
                                            {userKeys && userKeys.map((key) => {
                                                return (
                                                    <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                                                    getAppState={this.props.getAppStateFunc} projectID={this.props.getProjectDashboardState().project.key}
                                                    onClick={() => {
                                                        this.assignTask(key)
                                                    }} key={key} user={this.props.users[key]} userID={key} project={this.props.getProjectDashboardState().project}
                                                    />
                                                )
                                            })}
                                        </div>
                                        <button className="addCommentButton" style={{width: '200px'}} onClick={() => {
                                            this.assignTask(null)
                                        }}>Clear All Assigned Users</button>
                                    </div>
                                </Modal>

                                <div id="Task">
                                <i className="material-icons createProjectButton" onClick={this.testFunction}>backspace</i>

                            <div id="taskContentInfo" style={{right: '12px'}}>
                                {/*<b><ContentEditable disabled = {this.props.task.priorityLocked && !this.state.isManager} onChange = {this.changePriorityLevel} html={this.state.tempPriority}/></b>*/}
                                {/*<ContentEditable disabled = {this.props.task.hoursLocked && !this.state.isManager} onChange={this.changeEstimatedTimeValue} html={(this.state.tempHours)}/> {" hrs"}*/}
                                <ContentEditable disabled={this.props.task.dateLocked && !this.state.isManager} onChange={this.changeDeadline} className="text_small_light" html={this.getDaysLeft()}/>
                                </ div>
                            </div>
                            <div style={{visibility: this.state.visible}} id="taskInfo">

                                <div id="taskUsers">
                                    {assignedTo}
                                    {assignButton}
                                    <Modal open={this.state.addUserOpen} onClose={() => this.setState({addUserOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'assignUserModal'}}>
                                        <div>
                                            {/* <h1 className="taskAssignment">Task assignment</h1>*/}
                                            <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Select users to assign to this task</h4>
                                            <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '350px', "overflow": "scrollable"}}>
                                                {userKeys && userKeys.map((key) => {
                                                    return (
                                                        <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                                                            getAppState={this.props.getAppStateFunc} projectID={this.props.getProjectDashboardState().project.key}
                                                            onClick={() => {
                                                                this.assignTask(key)
                                                            }} key={key} user={this.props.users[key]} userID={key} project={this.props.getProjectDashboardState().project}
                                                            />
                                                    )
                                                })}
                                            </div>
                                            <button className="addCommentButton" style={{width: '200px'}} onClick={() => {
                                                    this.assignTask(null)
                                                }}>Clear All Assigned Users</button>
                                            </div>
                                        </Modal>

                                        <div id="Task">
                                            <i className="material-icons createProjectButton" onClick={this.testFunction}>backspace</i>

                                        </div>
                                    </div>

                                    <p id="taskDescription" className="text_small_light"><ContentEditable disabled={this.props.task.descriptionLocked && !this.state.isManager} onChange={this.changeTaskDescription}
                                        html={this.state.tempDescription} /> </p>

                                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
                                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: this.props.getProjectDashboardState().project.projectColor, height: '20px'}} id="taskInfoBubble">
                                            <p className="text_small_light" style={{color: 'white'}}><ContentEditable disabled = {this.props.task.hoursLocked && !this.state.isManager} onChange={this.changeEstimatedTimeValue}  html={(this.state.tempHours)}/></p>
                                            <p className="text_small_light" style={{marginLeft: '5px', color: 'white'}}>hrs</p>
                                        </div>
                                        <p className="text_small_light" id="taskInfoBubble" style={{backgroundColor: this.props.getProjectDashboardState().project.projectColor}}>{this.state.taskCategory}</p>
                                    </div>



                                    <div id="taskComments">

                                        {taskComments}


                                        <input type="text" name="Comment" id="CommentField" onChange={this.sendComment} value={this.state.commentValue} placeholder="Comment" className="commentInput" style={{width: '100%'}}/>
                                        <svg width="15px" height="18px" id="sendCommentArrow" onClick={this.postComment}>
                                            <title>Combined Shape</title>
                                            <desc>Created with Sketch.</desc>
                                            <defs></defs>
                                                <g id="Reiterate-on-Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <g id="Desktop" transform="translate(-772.000000, -493.000000)" fill="#B8B8B8">
                                                        <path d="M783.7,509.5 L788.5,509.5 L779.5,494.5 L770.5,509.5 L775.3,509.5 L779.5,502.5 L783.7,509.5 Z" id="Combined-Shape" transform="translate(779.500000, 502.000000) rotate(90.000000) translate(-779.500000, -502.000000) "></path>
                                                    </g>
                                                </g>
                                        </svg>
                                    </div>
                                    <div >
                                        <p className="errorBox">{this.state.changeErrorMessage}</p>
                                    </div>
                                    <center>
                                        <svg width="46px" height="10px" viewBox="0 0 11 6" onClick={this.switch} id="closeTaskArrow">
                                            <title>Path 3</title>
                                            <desc>Created with Sketch.</desc>
                                            <defs></defs>
                                                <g id="Reiterate-on-Design" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                                                    <g id="Desktop" transform="translate(-447.000000, -527.000000)" stroke="#979797">
                                                        <polyline id="Path-3" points="447 536 458.591602 528 470 536"></polyline>
                                                    </g>
                                                </g>
                                        </svg>
                                    </center>
                                </div>
                            </div>

                        </div>
                    )

                } else {
                    finalRender = (
                        <div onClick={() => {
                                if (!this.state.open) {
                                    this.switch()
                                }
                            }} >
                            <div id="task" style={this.css()}>
                                <div id="taskStats">
                                    <div id="taskCheckAndTitle">
                                        <svg height="40" width="40">

                                            <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox" style={this.checkRectIsArchived()} onClick={this.toggleArchived}/>
                                            <line x1="5" x2="10" y1="19" y2="25" style={this.checkIsVisible()} className="checkBox" />
                                            <line x1="10" x2="17" y1="25" y2="13" style={this.checkIsVisible()} className="checkBox" />
                                        </svg>
                                        <h4 id="taskTitle"><ContentEditable disabled={this.props.task.titleLocked && !this.state.isManager} onChange={this.changeTaskName} html={this.state.tempTitle}/></h4>
                                    </div>
                                    <div id="taskContentInfo" style={{right: '12px'}}><b><ContentEditable disabled={this.props.task.priorityLocked && !this.state.isManager} onChange = {this.changePriorityLevel} html={this.state.tempPriority}/></b> | <ContentEditable disabled = {this.props.task.hoursLocked && !this.state.isManager} onChange={this.changeEstimatedTimeValue} html={(this.state.tempHours)}/> {" hrs"} | <ContentEditable disabled={this.props.task.dateLocked && !this.state.isManager} onChange={this.changeDeadline} html={this.getDaysLeft()}/> </ div>
                                    </div>
                                    <div style={{visibility: this.state.visible}} id="taskInfo">
                                        <p id="taskDescription"><ContentEditable disabled={this.props.task.descriptionLocked && !this.state.isManager} onChange={this.changeTaskDescription}
                                            html={this.state.tempDescription} /> </p>
                                        <div id="taskUsers">
                                            {assignedTo}
                                            {assignButton}
                                            <Modal open={this.state.addUserOpen} onClose={() => this.setState({addUserOpen: false})} little classNames={{overlay: 'assignUserOverlay', modal: 'assignUserModal'}}>
                                                <div>
                                                    {/* <h1 className="taskAssignment">Task assignment</h1>*/}
                                                    <h4 className="taskAssignmentInstructions" style={{"text-align": "left", "margin-top": "5px"}}>Select users to assign to this task</h4>
                                                    <div id="ProjectCollaboratorsBarContainter" style={{"background-color": "white", "margin-bottom": "15px", "margin-left": "-7px", width: '350px', "overflow": "scrollable"}}>
                                                        {userKeys && userKeys.map((key) => {
                                                            return (
                                                                <UserIcon color={this.props.getProjectDashboardState().project.projectColor}
                                                                    getAppState={this.props.getAppStateFunc} projectID={this.props.getProjectDashboardState().project.key}
                                                                    onClick={() => {
                                                                        this.assignTask(key)
                                                                    }} key={key} user={this.props.users[key]} userID={key} project={this.props.getProjectDashboardState().project}
                                                                    />
                                                            )
                                                        })}
                                                    </div>
                                                    <button className="addCommentButton" style={{width: '200px'}} onClick={() => {
                                                            this.assignTask(null)
                                                        }}>Clear All Assigned Users</button>
                                                    </div>
                                                </Modal>

                                                <div id="Task">
                                                    <i className="material-icons createProjectButton" onClick={this.testFunction}>backspace</i>

                                                </div>
                                            </div>

                                            <div id="taskComments">
                                                // <button type="button" onClick={this.postComment}>Comment</button>
                                                <input type="text" placeholder="Comment" className="commentInput" style={{width: '100%'}}/>
                                                <button className="addCommentButton" onClick={this.postComment}>Add Comment</button>
                                                <button className="addCommentButton" onClick={this.switch} style={{marginLeft:'10px'}} >Close Task</button>
                                            </div>
                                            <div>
                                                <p className="errorBox">{this.state.changeErrorMessage}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div>{finalRender}</div>

                        )
                    }
                }

                export default Task;
