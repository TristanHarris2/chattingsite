(function(){

    const app = document.querySelector(".app");
    const socket = io();
    const roomContainer = document.getElementById('room-container')

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click", function(){
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0){
            return;
        }
        socket.emit("newUser", roomName, username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        };
        renderMessage("my", {
            username: uname,
            text: message,
        });
        socket.emit("chat", roomName, {
            username: uname,
            text: message
        })
        app.querySelector(".chat-screen #message-input").value='';
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        socket.emit("exitUser", roomName, uname);
        window.location.href = '/';
    });

    socket.on('room-created', room => {
        const roomElement = document.createElement('div')
        roomElement.innerText = room
        const roomLink = document.createElement('a')
        roomLink.href = `/${room}`
        roomLink.innerText = 'join'
        roomContainer.append(roomElement)
        roomContainer.append(roomLink)
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });

    socket.on("chat", function(message){
        renderMessage("other", message);
    });

    function renderMessage(type,message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message msg-contain");
            el.innerHTML = `
            <div id="msg">
                <div id="self" class="name">You</div>
                <div id="self" class="text">${message.text} </div>
            </div>
            `;
            messageContainer.appendChild(el)
        } else if(type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div id="oth-msg">
                <div class="name">${message.username}</div>
                <div class="text">${message.text} </div>
            </div>
            `;
            messageContainer.appendChild(el)
        } else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el)
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight 
    }    
})();