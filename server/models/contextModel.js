const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ContextSchema = new mongoose.Schema({
    contextId: {
        type: String,
        default: uuidv4,
        required: true
    },
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organisation',
        required: function () {
            return !this.temporary;
        }
    },
    temporary: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    oldContext: {
        type: String,
        required: true
    },
    refineContext: {
        type: String,
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Context', ContextSchema);
