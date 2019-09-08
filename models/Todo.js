const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: { type: String, trim: true, default: '' },
});

module.exports = mongoose.model('Todo', todoSchema);