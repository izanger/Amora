import React, {Component} from 'react'
import {auth, google} from "./rebase.js"
import {Row, Grid, Col} from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
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
              <Row className="login-row">
                <Col xs={1} sm={3} md={3}>

                </Col>
                <Col xs={10} sm={6} md={6}>
                    <center><img className="amora" src={amoraLogo} /></center>
                      <div className="subtitle">Teamwork Makes the Dream Work</div>
                      <button className="signin-button" onClick={this.signin}>
                          Sign in with Google
                      </button>
                </Col>
                <Col xs={1} sm={3} md={3}>

                </Col>
              </Row>

              <Row>

              </Row>
            </Grid>
        )
    }

}

export default Login;
