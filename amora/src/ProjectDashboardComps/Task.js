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
           addUserId: "",
           commentValue: "",
           addedComment: false,
           commentsSynced: false,
           edited: "",
           taskComments: {
            
           },
           isManager: false
       }
    }

    componentWillMount = () => {
        const newState = { ...this.state }
        newState.isManager = !(this.props.getProjectDashboardState().project.managerList[this.props.getAppStateFunc().user.uid] == undefined)
        let arch = this.props.archived
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
        }else {
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
        // rebase.fetch(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments`, {
        //     context: this,
        //     then: (data) => {
        //         newState.taskComments = data
        //     }
        // }).then(() => {
        //     this.bindingref = rebase.syncState(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments`, {
        //         context: this,
        //         state: 'taskComments',
        //         then: () => {
        //             newState.commentsSynced = true
        //             this.setState(newState)
        //         }
        //     })
        // })
    }

    componentWillUnmount = () => {
        this.setState({
            commentsSynced: false
        })
    }

    switch = () => {
        if (this.state.open){
            this.setState({ open: false, visible: 'hidden' });
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
            return ({height: '40px'})
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

    toggleSync = (archive) => {
        if(archive){
            if(this.bindingref){
                rebase.removeBinding(this.bindingref)
            }
            this.bindingref = rebase.syncState(`projects/${this.props.projectID}/archivedTaskList/${this.props.taskKey}/taskComments`, {
                context: this,
                state: 'taskComments',

            })

        }else {
            if(this.bindingref){
                rebase.removeBinding(this.bindingref)
            }
            this.bindingref = rebase.syncState(`projects/${this.props.projectID}/taskList/${this.props.taskKey}/taskComments`, {
                context: this,
                state: 'taskComments',

            })
        }
    }

    //Ian: Archive the task if it's archived. Unarchive it if it's not.
    toggleArchived = () => {
        if (this.props.archived){
            //Unarchive
            const projID = this.props.projectID;
            const taskID = this.props.taskKey;
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

                            //this.toggleSync(false)

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

                            //this.toggleSync(true)

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
        if (event.target.value.length !== 0) {
            const newState = this.props.getProjectDashboardState()
            if(this.props.archived){
                newState.project.archivedTaskList[this.props.taskKey].taskName = event.target.value
            }else {
                newState.project.taskList[this.props.taskKey].taskName = event.target.value
            }
            if (!newState.project.taskList[this.props.taskKey].titleLocked && this.state.isManager) {
                this.postCommentForManagerEdit("Title value has been locked by a manager")
            }
            if (this.state.isManager) {
                newState.project.taskList[this.props.taskKey].titleLocked = true;
            }
            this.props.setProjectDashboardState(newState)
        }
    }

    changeDeadline = (event) => {
        if (validateDate(event.target.value)){
            console.log("SUCCESS")
            const newState = this.props.getProjectDashboardState()
            if(this.props.archived){
                newState.project.archivedTaskList[this.props.taskKey].deadline = event.target.value;
            }else {
                newState.project.taskList[this.props.taskKey].deadline = event.target.value;
            }
            if (!newState.project.taskList[this.props.taskKey].dateLocked && this.state.isManager) {
                this.postCommentForManagerEdit("Date value has been locked by a manager")
            }
            if (this.state.isManager) {
                newState.project.taskList[this.props.taskKey].dateLocked = true;
            }
            this.props.setProjectDashboardState(newState);
        }

    }

    changeTaskDescription = (event) => {
        if (event.target.value !== "") {
            const newState = this.props.getProjectDashboardState()
            if(this.props.archived){
                newState.project.archivedTaskList[this.props.taskKey].taskDescription = event.target.value
            }else {
                newState.project.taskList[this.props.taskKey].taskDescription = event.target.value
            }
            if (!newState.project.taskList[this.props.taskKey].descriptionLocked && this.state.isManager) {
                this.postCommentForManagerEdit("Description value has been locked by a manager")
            }
            if (this.state.isManager) {
                newState.project.taskList[this.props.taskKey].descriptionLocked = true;
            }
            this.props.setProjectDashboardState(newState)
        }
    }
    changePriorityLevel = (event) => {
        if (event.target.value !== "") {
            const newState = this.props.getProjectDashboardState()
            if(this.props.archived){
                newState.project.archivedTaskList[this.props.taskKey].priorityLevel = event.target.value
            }else {
                newState.project.taskList[this.props.taskKey].priorityLevel = event.target.value
            }
            if (!newState.project.taskList[this.props.taskKey].priorityLocked && this.state.isManager) {
                this.postCommentForManagerEdit("Priority value has been locked by a manager")
            }
            if (this.state.isManager) {
                newState.project.taskList[this.props.taskKey].priorityLocked = true;
            }
            this.props.setProjectDashboardState(newState)
        }
    }

    changeEstimatedTimeValue = (event) => {
        if (event.target.value !== "") {
            const newState = this.props.getProjectDashboardState()
            if(this.props.archived){
                newState.project.archivedTaskList[this.props.taskKey].EstimatedTimeValue = event.target.value
            }else {
                newState.project.taskList[this.props.taskKey].EstimatedTimeValue = event.target.value
            }
            if (!newState.project.taskList[this.props.taskKey].hoursLocked && this.state.isManager) {
                this.postCommentForManagerEdit("Estimated time value has been locked by a manager")
            }
            if (this.state.isManager) {
                newState.project.taskList[this.props.taskKey].hoursLocked = true;
            }
            this.props.setProjectDashboardState(newState)
        }
    }

    getPriorityLevel = () => {
        console.log(this.props.task.priorityLevel)
        return "!!"
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



    // fixDeadline = () => {
    //     //2018-02-21T18:28:59-05:00
    //     const date = this.props.task.deadline
    //     //2018  02   21T18:28:59  05:00

    //     const boolContinue = date.includes("-");
    //     if (!boolContinue){
    //         const newState = { ...this.state }
    //     newState.editedDate = true
    //     this.setState(newState)
    //         return date;
    //     }
    //     const firstSplit = date.split("-");

    //     const month = firstSplit[1]; //02

    //     const year = firstSplit[0];

    //     //21     18:28:59
    //     const secondSplit = firstSplit[2].split("T");

    //     const day = secondSplit[0];

    //     //time to assemble the pieces dudes

    //     const finalOutput = "" + month + "/" + day + "/" + year;

    //     return finalOutput;




    // }


    getDaysLeft = () => {
        //const thing = this.props.task.deadline
        const fixedDeadline = this.props.task.deadline
        //console.log(fixedDeadline)
        if (this.state.open){
            //console.log("HERE" + this.props.task.deadline)
            return this.props.task.deadline;
        }
        // MM/DD/YY
        const dueDate = fixedDeadline.split("/");
        //const curDate = this.fixCurrentDate.split("/");
        //console.log(dueDate[2])
        //console.log(dueDate[1])
        //console.log(dueDate[0])
        const year = dueDate[2];
        let month = dueDate[0];
        const day = dueDate[1]
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
            }
        });

        // const banana = moment([dueDate[2], dueDate[1], dueDate[0]]).fromNow();
        //console.log("Year: " + year)
        //console.log("Month: " + month)
        //console.log("Day: " + day)
        const banana = moment([year, month, day]).fromNow();
        //console.log("THIS ONE: " +banana)
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
                            <svg height="40" width="40">

                                 <rect x="1" y="9" rx="5" ry="5" width="20" height="20" className="checkBox" style={this.checkRectIsArchived()} onClick={this.toggleArchived}/>
                                 <line x1="5" x2="10" y1="19" y2="25" style={this.checkIsVisible()} className="checkBox" />
                                 <line x1="10" x2="17" y1="25" y2="13" style={this.checkIsVisible()} className="checkBox" />
                            </svg>
                            <h4 id="taskTitle"><ContentEditable disabled={this.props.task.titleLocked && !this.state.isManager} onChange={this.changeTaskName} html={this.props.task.taskName}/></h4>
                        </div>
                        <div id="taskContentInfo" style={{right: '12px'}}><b><ContentEditable disabled = {this.props.task.priorityLocked && !this.state.isManager} onChange = {this.changePriorityLevel} html={this.props.task.priorityLevel}/></b> | <ContentEditable disabled = {this.props.task.hoursLocked && !this.state.isManager} onChange={this.changeEstimatedTimeValue} html={(this.props.task.EstimatedTimeValue)}/> {" hrs"} | <ContentEditable disabled={this.props.task.dateLocked && !this.state.isManager} onChange={this.changeDeadline} html={this.getDaysLeft()}/> </ div>
                    </div>
                    <div style={{visibility: this.state.visible}} id="taskInfo">
                        <p id="taskDescription"><ContentEditable disabled={this.props.task.descriptionLocked && !this.state.isManager} onChange={this.changeTaskDescription}
                        html={this.props.task.taskDescription} /> </p>
                            <div id="taskUsers">
                                {assignedTo}

                                <AddUserButton onClick={() => {
                                    this.setState({addUserOpen: true})
                                }}/>
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

                                {taskComments}


                                    <input type="text" name="Comment" id="CommentField" onChange={this.sendComment} value={this.state.commentValue} placeholder="Comment" className="commentInput" style={{width: '100%'}}/>
                                  <button className="addCommentButton" onClick={this.postComment}>Add Comment</button>
                                  <button className="addCommentButton" onClick={this.switch} style={{marginLeft:'10px'}} >Close Task</button>
                            </div>

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
                                <h4 id="taskTitle"><ContentEditable disabled={this.props.task.titleLocked && !this.state.isManager} onChange={this.changeTaskName} html={this.props.task.taskName}/></h4>
                            </div>
                            <div id="taskContentInfo" style={{right: '12px'}}><b><ContentEditable disabled={this.props.task.priorityLocked && !this.state.isManager} onChange = {this.changePriorityLevel} html={this.props.task.priorityLevel}/></b> | <ContentEditable disabled = {this.props.task.hoursLocked && !this.state.isManager} onChange={this.changeEstimatedTimeValue} html={(this.props.task.EstimatedTimeValue)}/> {" hrs"} | <ContentEditable disabled={this.props.task.dateLocked && !this.state.isManager} onChange={this.changeDeadline} html={this.getDaysLeft()}/> </ div>
                        </div>
                        <div style={{visibility: this.state.visible}} id="taskInfo">
                            <p id="taskDescription"><ContentEditable disabled={this.props.task.descriptionLocked && !this.state.isManager} onChange={this.changeTaskDescription}
                            html={this.props.task.taskDescription} /> </p>
                            <div id="taskUsers">
                                {assignedTo}

                                <AddUserButton onClick={() => {
                                    this.setState({addUserOpen: true})
                                }}/>
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
