import React, { Component } from 'react';
import rebase, { auth, google } from "./rebase.js"

//Simple Component for updating the display name of a user
class UpdateName extends Component {
    constructor() {
        super()
        
    }

    componentDidMount = () => {
        auth.onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
              rebase.syncState(`user`, {
                context: this,
                state: 'displayName',
                asArray: true,
            })
            } else {
              // No user is signed in.
            }
          });
    }
    updateName(event) {
        this.setState({
            displayName: event.target.value
        })
    }

    render() {
        return (
            <div>
                <input type="text" value="" onChange={this.updateName}/>
            </div>
        )
    }
} 
export default UpdateName;