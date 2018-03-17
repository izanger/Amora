import React, { Component } from 'react'
import rebase from "../rebase";
import settingsIcon from "../images/Icons/Settings.svg"
import searchIcon from "../images/Icons/Search.svg"
import archiveIcon from "../images/Icons/Archive.svg"
import { checkIfManager } from "../apphelpers.js"
import { emailRegistered, validateEmail } from "../apphelpers.js"

import "./MyDayTitleBar.css"


import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

class MyDayTitleBar extends Component {

    constructor() {
        super()

        this.state = {

        }
    }


    render = () => {
        //let color = "#3CB4CB";



        return (
            <div id="myDayTitleContainer">
                <h1>My Day</h1>
            </div>
        )
    }

}

export default MyDayTitleBar;
