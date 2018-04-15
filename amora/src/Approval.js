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
        rebase.remove(`users/${this.props.getAppState().user.uid}/notifications/${this.props.notificationKey}`)

    }

    approveTask = () => {
        //remove notification 
        this.removeNotification()
        //archive the task
        rebase.fetch(`users/${this.props.getAppState().user.uid}/projects/${this.props.notificationKey}`, {
            context: this,
            asArray: true,
            then(data){
              console.log(data);
              rebase.fetch(`projects/${data.key}/taskList/${data.taskID}`, {
                context: this,
                asArray: true,
                then(data){
                  console.log(data);

                  rebase.update(`projects/${data.key}/taskList/${data.taskID}`, {
                    data: {name: 'George'},
                    then(err){
                      if(!err){
                        Router.transitionTo('dashboard');
                        //bears endpint is now {name: 'George', type: 'Grizzly'}
                      }
                    }
                  });

                }
              });
            }
          });
        
    }

    rejectTask = () => {
        //remove notification
        this.removeNotification()
        //do nothing with the task
    }

    render = () => {
        return (
            <div className="inviteContainer">
                <p className="inviteText">This one is an invite</p>
                <p className="inviteText">You've been invited to join: {this.props.notification.projectName}</p>
                <p>Description: {this.props.notification.projectDescription}</p>
                <button className="inviteButton" onClick={this.approveTask}>Accept</button>
                <button className="inviteButton" onClick={this.rejectTask}>Decline</button>
            </div>
        )
    }
}

export default Notification;