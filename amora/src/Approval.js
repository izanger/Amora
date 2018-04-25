import React, { Component } from "react"
import rebase from "./rebase";

import "./Approval.css"

class Notification extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    removeNotification = () => {
        //fetch manager list
        rebase.fetch(`projects/${this.props.notification.key}/managerList`, {
            context: this,
            //asArray: true,
            then(data){
             // console.log(data);
              let arr = Object.keys(data)
              //console.log(arr)
              //console.log(this.props.projectID)
                arr.map((user) => {
                    //console.log(user)
                    //console.log(notification)
                    rebase.remove(`users/${user}/notifications/${this.props.notificationKey}`)
                    
                })
            }
          });
        

    }

    approveTask = () => {
        //remove notification 
        this.removeNotification()
        //archive the task
        // rebase.fetch(`users/${this.props.getAppState().user.uid}/projects/${this.props.notificationKey}`, {
        //     context: this,
        //     asArray: true,
        //     then(data){
        //       console.log(data);
        //       rebase.fetch(`projects/${data.key}/taskList/${data.taskID}`, {
        //         context: this,
        //         asArray: true,
        //         then(data){
        //           console.log(data);
        //           //move into archive
        //           this.archiveTask()



        //           //remove from taskList

        //         //   rebase.update(`projects/${data.key}/taskList/${data.taskID}`, {
        //         //     data: {name: 'George'},
        //         //     then(err){
        //         //       if(!err){
                        
        //         //         //bears endpint is now {name: 'George', type: 'Grizzly'}
        //         //       }
        //         //     }
        //         //   });

        //         }
        //       });
        //     }
        //   });

        this.archiveTask()

        
    }

    archiveTask = () => {
        // Archive
        const projID = this.props.notification.key;
        const taskID = this.props.notification.taskID;
       // console.log(projID)
       // console.log(taskID)

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
                               // console.log("stickfiddles")
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
           // console.log(data)
            let taskArray = Object.keys(data);
            //  console.log(taskArray)
            for (var i = 0; i < taskArray.length;i++ ){
                let tid = taskArray[i];


                rebase.fetch(`users/${this.props.userID}/todayView/${tid}`, {
                    context: this,
                }).then(data => {
                   // console.log(data)
                   // console.log(this.props.taskKey)
                    if (data.taskIDNumber === taskID){
                      //  console.log(taskArray[i])
                      //  console.log(taskID)

                        rebase.update(`users/${this.props.userID}/todayView/${tid}`, {
                            data: {completed: true},
                            then(err){
                              if(!err){
                                //console.log("Oh No 23436")
                              }
                            }
                          });
                    }
                })
            }
        })
    }

    rejectTask = () => {
        //remove notification
        this.removeNotification()
        //do nothing with the task
    }

    render = () => {
        return (
            <div className="inviteContainer">
                <p className="inviteText">Approve/Reject Task</p>
                <p className="inviteText">Task Name: {this.props.notification.taskName}</p>
                <p>Task Description: {this.props.notification.taskDescription}</p>
                <button className="inviteButton" onClick={this.approveTask}>Approve</button>
                <button className="inviteButton" onClick={this.rejectTask}>Reject</button>
            </div>
        )
    }
}

export default Notification;