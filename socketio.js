const connectedUsers = require("./src/events/ConnectedUsers");
const User = require("./src/models/User");

module.exports = function (io) {

    io.on("connection", (socket) => {
        console.log('A client is connected')

        socket.on("login", async (auth) => {
            const { email, password } = await auth
            const user = await User.findByCredentials(email, password)
            if (!user) {
                console.log("disconnecting")
                socket.disconnect("disconnect")
            }

            connectedUsers.addClient(user.uid, socket)
        })

        socket.on("disconnect", () => {
            connectedUsers.removeClient()
            socket.disconnect("disconnect");
        })
    });
};