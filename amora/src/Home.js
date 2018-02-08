import React, {Component} from 'react'
import {auth, google} from "./rebase.js"
import {Row, Grid, Col} from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import "./Home.css"

class Home extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {
        return (
            <div id="mainContainer">
                <div id="projectsSelector">
                    Hello
                </div>

                <div id="taskDashboard">
                    I am a goddamn task
                </div>
            </div>
        )
    }

}

export default Home;
