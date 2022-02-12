const socket = io()

const form = document.getElementById('form');
const input = document.getElementById('message');
const messages = document.getElementById('chat-box-messages')
const chatBox = document.getElementById('chat-box')

//Pull Message from Server
socket.on('message', message => {
    outputMessage(message)
    chatBox.scrollTop = chatBox.scrollHeight
})


//Capture User Submitted Messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });



//Formatting new message and output to dom
function outputMessage(message) {
  const newMsg = document.createElement('li')
  newMsg.classList.add('message');
   const p = document.createElement('p');
   p.classList.add('meta');
//   p.innerText = message.username;
   p.innerHTML += `<span>${message.time}</span>`;
   newMsg.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  newMsg.appendChild(para);
  messages.appendChild(newMsg);
}
