const Contact = require('../models/Contact');
const { validateEmailAddress } = require('../utils/emailValidator');

const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        // Multi-Layer Genuine Email Verification (DNS, Typos, Disposable, Gmail rules)
        const emailValidation = await validateEmailAddress(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ message: emailValidation.error || 'Enter a valid email' });
        }

        // Validate 10-digit Indian Mobile Number if provided
        let cleanPhone = '';
        if (phone) {
            cleanPhone = String(phone).replace(/\D/g, '');
            if (cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
                return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number' });
            }
        }

        // Mock save if DB is not connected
        if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
            console.log('Mocked Contact Submission:', { name, email: emailValidation.email, phone: cleanPhone, subject, message });
            return res.status(201).json({ message: 'Message received (mocked)' });
        }

        const newContact = new Contact({ 
            name: name.trim(), 
            email: emailValidation.email, 
            phone: cleanPhone,
            subject: (subject || 'General Inquiry').trim(), 
            message: message.trim() 
        });
            subject: (subject || 'General Inquiry').trim(), 
            message: message.trim() 
        });
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

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Contact.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Inquiry not found in database' });
        }
        res.status(200).json({ message: 'Inquiry deleted successfully from database' });
    } catch (error) {
        console.error('Error deleting contact inquiry:', error);
        res.status(500).json({ message: 'Server error while deleting inquiry' });
    }
};

module.exports = { submitContact, getContacts, deleteContact };
