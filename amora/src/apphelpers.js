
export function isObjectEmpty(obj) {
    if (Object.keys(obj).length === 0) {
        return true;
    }
    return false;
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

export function createUniqueID() {
    let s = ""
    for (let i = 0; i < 12; i++) {
        s += Math.floor(Math.random() * 10).toString()
    }
    return s
}