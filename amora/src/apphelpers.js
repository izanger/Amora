import rebase, { auth, google } from "./rebase.js"

export function isObjectEmpty(obj) {
    if (Object.keys(obj).length === 0) {
        return true
    }
    return false
}

export function buildUserFromGoogle(user) {
    const newUser = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        uid: user.uid,
        projects: [ ],
        invites: [ ]
    }
    return newUser
}

export function emailRegistered(email) {
    let ret = false
    ret = rebase.initializedApp.database().ref().child("users").orderByChild("email").equalTo(email).once("value", snapshot => {
        const userData = snapshot.val()
        if (snapshot.val()) {
            ret =  true
        }
    })
    return ret
}

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}