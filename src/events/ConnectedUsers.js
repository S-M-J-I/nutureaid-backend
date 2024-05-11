class ConnectedUsers {
    constructor() {
        this.connectedUsers = {}
    }

    addClient(uid, socket) {
        this.connectedUsers[uid] = socket
        console.log(`Connected user id ${uid}`)
    }

    removeClient(uid) {
        delete this.connectedUsers[uid]
    }
}

const connectedUsers = ConnectedUsers


module.exports = connectedUsers