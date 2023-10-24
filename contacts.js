const fs = require("node:fs/promises");
const path = require("node:path");
const contactsPath = path.join(__dirname, '/db/contacts.json');

function generateCustomId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);

    return timestamp + randomPart;
}

const listContacts = async () => {
    try {
        const data = await fs.readFile(contactsPath);
        return JSON.parse(data);
    } catch {
        console.error('Error reading contacts.');
        return [];
    }
}

const getContactById = async (id) => {
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === id);
    return result || null;
}

const removeContact = async (id) => {
    const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if (index === -1) {
        return null;
    }
    const [result] = contacts.splice(index, 1);

    try {
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch {
        console.error('Error writing contacts.');
    }

    return result;
}

const addContact = async (data) => {
    const contacts = await listContacts();
    const newContact = {
        id: generateCustomId(),
        ...data,
    }
    contacts.push(newContact);

    try {
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    } catch {
        console.error('Error writing contacts.');
    }

    return newContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}
