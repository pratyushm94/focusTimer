const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    durationSeconds: {
        type: Number,
        required: true,
        min: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    note: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

//compound indexing
sessionSchema.index({userId: 1, startTime: -1});

module.exports = mongoose.model('Session', sessionSchema);