const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios'); // To make API calls to Gemini

const OrganisationSchema = new mongoose.Schema(
    {
        OrgId: {
            type: String,
            default: uuidv4,
            required: true,
        },
        OrgName: {
            type: String,
            required: true,
        },
        OrgDes: {
            type: String,
            required: true,
        },
        CreatedBy: {
            type: String, // User ID
            required: true,
        },
        contexts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Context',
            },
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Organisation', OrganisationSchema);