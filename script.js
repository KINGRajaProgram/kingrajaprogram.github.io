const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage('user', userMessage);

    userInput.value = '';
    try {
        const response = await fetchChatGPT(userMessage);
        addMessage('bot', response);
    } catch (error) {
        console.error('Error fetching response from OpenAI:', error);
        addMessage('bot', 'Sorry, I am having trouble right now. Please try again later.');
    }
}

function addMessage(sender, text) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message', `${sender}-message`);

    const avatar = document.createElement('img');
    avatar.src = sender === 'bot' ? 'bot.png' : 'user.png';
    avatar.alt = `${sender} Avatar`;
    avatar.classList.add('avatar');

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = text;

    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageText);
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function fetchChatGPT(message) {
    const apiKey = 'YOUR_API_KEY';  // Replace with your actual OpenAI API key
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: message,
            max_tokens: 150
        })
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].text) {
        throw new Error('Invalid response from OpenAI');
    }

    return data.choices[0].text.trim();
}
