import SocketService from "./socketService";
import { ChatApi } from "../shared/chatApi";

let client: SocketService<ChatApi>;
let username: string;

window.addEventListener("DOMContentLoaded", function() {
    client = new SocketService();
    document.getElementById("connecting").remove();
    document.getElementById("login").style.display = "block";
    document.getElementById("login-button").addEventListener(
        "onclick", login
    );
    document.getElementById("message").addEventListener(
        "onkeyup", sendMessage
    );
}, false);

function login() {
    username = (<HTMLInputElement>document.getElementById("username")).value;
    client.sock.emit("newUser", {username: username}, success => {
        document.getElementById("login").remove();
        document.getElementById("chat").style.display = "block";
        const messages = document.getElementById("messages");
        client.on("newMessage").subscribe(({data}) => {
            messages.innerText += "[" + data.username + "] " + data.message + "\n";
        });
        client.on("newUser").subscribe(({data}) => {
            messages.innerText += data.username + " joined.\n";
        });
        client.on("userDisconnected").subscribe(({data}) => {
            messages.innerText += data.username + " left.\n";
        });
    });
}

function sendMessage(event: KeyboardEvent) {
    if (event.key !== "Enter") { return; }
    const target = <HTMLInputElement>event.target;
    const message = target.value;
    target.value = "";
    const messages = document.getElementById("messages");
    messages.innerText += "[" + username + "] " + message + "\n";
    client.sock.emit("newMessage", {username: username, message: message});
}

