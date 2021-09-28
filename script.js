class MQTTMessage {
    constructor(topic = '', message = []) {
        this.topic = topic;
        this.message = message;
        this.children = []
    }
}

class MessageStore {
    constructor() {
        this.messages = []; // Array of trees
    }
    addMessage(topic, message) {
        //Add message to the store so that it may be retrieved by its topic in the following method
        const topics = topic.split('/');
        let actualTree = this.messages;
        topics.forEach((actualTopic) => {
            let indexNodeFound = actualTree.findIndex(selectChild => selectChild.topic === actualTopic);
            if (indexNodeFound !== -1) {
                actualTree[indexNodeFound].message.push(message);
                actualTree = actualTree[indexNodeFound].children;
            } else {
                const newItem = new MQTTMessage(actualTopic, [message]);
                actualTree.push(newItem);
                actualTree = actualTree[actualTree.length - 1].children;
            }
        });
    }

    getMessagesByTopic(topic) {
        const topics = topic.split('/');
        let actualTree = this.messages;
        let result = [];
        topics.every((actualTopic) => {
            let indexNodeFound = actualTree.findIndex(selectChild => selectChild.topic === actualTopic);
            if (indexNodeFound !== -1) {
                result = actualTree[indexNodeFound].message;
                actualTree = actualTree[indexNodeFound].children;
                return true;
            } else {
                results = [];
                return false;
            }
        });
        console.log(result);
        //Return all messages from matching topics in chronological order
    }
}

//Tests
const store = new MessageStore()

//Add messages to store as they are recieved by the MQTT client
store.addMessage('device/sensor/temperature', '23C')
store.addMessage('device/light/overhead', 'turn on')
store.addMessage('device/light/tube', 'dim 50%')
store.addMessage('device/light/overhead', 'color 3500K')

//Get messages by topic
store.getMessagesByTopic('device/light/overhead')
// ['turn on', 'color 3500K']

store.getMessagesByTopic('device/light')
// ['turn on', 'dim 50%', 'color 3500K']

store.getMessagesByTopic('device')
// ['23C', 'turn on', 'dim 50%', 'color 3500K']


