import rebase from "./rebase.js"

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
        uid: user.uid
    }
    return newUser
}

export function emailRegistered(email) {
    let ret = false
    ret = rebase.initializedApp.database().ref().child("users").orderByChild("email").equalTo(email).once("value", snapshot => {
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

export function validateDate(date) {
    var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;
    if(!(date_regex.test(date))) {
        return false;
    }
    return true;
}




//Returns a promise regarding the user's status as manager
//For example of how to use this function, check out Ben's use of the emailRegistered()
//function in the emailValidationProcess() method of CreateProjectForm.js
export function checkIfManager(userID, projectID) {
   let ret = false;
        ret = rebase.initializedApp.database().ref().child("projects/" + projectID + "/managerList/" + userID).once("value", snapshot => {
            if(snapshot.val()) {
                ret = true
            }
        })
        return ret
    }
    
//Returns a promise regarding the user's status as part of that project
//For example of how to use this function, check out Ben's use of the emailRegistered()
//function in the emailValidationProcess() method of CreateProjectForm.js
export function checkIfUserOnProject(userID, projectID) {
    let ret = false;
    ret = rebase.initializedApp.database().ref().child("projects/" + projectID + "/userList/" + userID).once("value", snapshot => {
        if(snapshot.val()) {
            ret = true
        }
    })
    return ret
}