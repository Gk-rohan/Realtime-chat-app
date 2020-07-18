const socket = io('http://localhost:8000');

//Get DOM elements in respective JS varaibles
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container')
// Audio that will play on receiving message
var audio = new Audio('message.mp3');

//Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left'){
        audio.play();
    }
}

// ask the user his/her name, and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

//if a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined chat`, 'right');

})
// if server sends a message , receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left');
})

//if user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'left');
})

//if form gets submitted  ,send the message
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})