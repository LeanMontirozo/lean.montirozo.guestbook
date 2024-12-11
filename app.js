const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

app.use(express.static('public'));

const dataFilePath = path.join(__dirname, 'data', 'guestbook.json');

const readMessagesFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeMessagesToFile = (messages) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(messages, null, 2), 'utf8');
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'guestbook.html'));
});

app.get('/messages', (req, res) => {
    const messages = readMessagesFromFile();
    res.json(messages);
});

app.post('/sign', (req, res) => {
    const { name, message } = req.body;
    if (name && message) {
        const messages = readMessagesFromFile();
        messages.push({ name, message });
        writeMessagesToFile(messages);
    }
    res.status(200).send();
});

app.listen(1000, () => {
    console.log('Guestbook app running on http://localhost:1000');
});
