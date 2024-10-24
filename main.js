const socket = io();

let username = '';
let userPhoto = ''; // Store user photo in Base64 format

const joinChatButton = document.getElementById('join-chat');
const usernameInput = document.getElementById('username');
const photoInput = document.getElementById('photo');
const chatForm = document.getElementById('chat-form');
const input = document.getElementById('msg');
const messages = document.getElementById('messages');
const userDisplay = document.getElementById('user-display'); // For displaying the current user
const userDialog = document.getElementById('user-dialog'); // User dialog element

// When user clicks "Join Chat"
joinChatButton.addEventListener('click', function() {
    username = usernameInput.value.trim();
    
    // Check if a file is selected
    const file = photoInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            userPhoto = reader.result; // Get the Base64 string of the image
            // Hide the user dialog and show the chat form
            userDialog.style.display = 'none';
            chatForm.style.display = 'flex';
            
            // Display the username and photo on top
            userDisplay.innerHTML = `Logged in as: <strong>${username}</strong> <img src="${userPhoto}" alt="User Photo" style="width:30px;height:30px;border-radius:50%;">`;
            
            // Notify server about new user
            socket.emit('user joined', username);
        };
        reader.readAsDataURL(file); // Convert the image file to Base64
    }
});

chatForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission
    if (input.value) {
        // Send message along with username
        socket.emit('chat message', { username, message: input.value });
        input.value = ''; // Clear the input field
    }
});

socket.on('chat message', function({ username: sender, message }) {
    const item = document.createElement('div');
    
    // Check if the sender is the current user or not
    if (sender === username) {
        item.classList.add('my-message');
        item.innerHTML = `<div class="message-content"><strong>You:</strong> ${message}</div>`;
    } else {
        item.classList.add('other-message');
        item.innerHTML = `<div class="message-content"><strong>${sender}:</strong> ${message}</div>`;
    }
    
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight; // Auto-scroll to the bottom
});

socket.on('user joined', function(username) {
    const item = document.createElement('div');
    item.classList.add('system-message');
    item.textContent = `${username} joined the chat`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});
