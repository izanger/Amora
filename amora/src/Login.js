import React, {Component} from 'react'
import {auth, google} from "./rebase.js"
import {Row, Grid, Col} from 'react-bootstrap'

import amoraLogo from "./amora_logo_small.png"
import "./Login.css"

class Login extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    signin = () => {
        auth.signInWithPopup(google)
    }

    render = () => {
        return (
            <Grid fluid className="login-grid">
                <Col md={2}>
                    
                </Col>
                <Col md={8}>
                    <img className="amora" src={amoraLogo} />
                    <div className="subtitle">Teamwork makes the dream work</div>
                    <button className="signin-button" onClick={this.signin}>
                        Sign in with Google
                    </button>
                </Col>
                <Col md={2}>
                    
                </Col>
            </Grid>
        )
    }
    
}

export default Login;