const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Mock save if DB is not connected
        if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
            console.log('Mocked Contact Submission:', { name, email, subject, message });
            return res.status(201).json({ message: 'Message received (mocked)' });
        }

        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();
        
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({ message: 'Server error while sending message' });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error while fetching contacts' });
    }
};

module.exports = { submitContact, getContacts };
