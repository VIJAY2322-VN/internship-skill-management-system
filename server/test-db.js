require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));

mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
})
.then(() => {
    console.log('SUCCESS: Connected to MongoDB 🚀');
    process.exit(0);
})
.catch(err => {
    console.error('FAILURE:', err.message);
    if (err.message.includes('ENOTFOUND')) console.log('Advice: DNS issue. Check if you can ping google.com');
    if (err.message.includes('ETIMEDOUT')) console.log('Advice: Firewall or IP Whitelist issue.');
    process.exit(1);
});
