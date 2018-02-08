import React, {Component} from 'react'
import {auth, google} from "./rebase.js"
import {Row, Grid, Col} from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"
import googleLoginNormal from "./images/btn_google_signin_light_normal_web@2x.png"
import googleLoginPressed from "./images/btn_google_signin_dark_pressed_web@2x.png"
import googleLoginHover from "./images/btn_google_signin_light_focus_web@2x.png"
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
                      {/*<button className="signin-button" onClick={this.signin}>
                          Sign in with Google
                      </button>*/}
                      <img onClick={this.signin} className="googleLogin" src={googleLoginNormal}></img>
                </Col>
                <Col xs={1} sm={3} md={3}>

                </Col>
              </Row>
            </Grid>
        )
    }

}

export default Login;
