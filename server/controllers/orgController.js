const Organisation = require('../models/orgModel');

// Controller to create an organization
const createOrganisation = async (req, res) => {
    try {
        const { OrgName, OrgDes ,user_Id} = req.body;

        if (!OrgName || !OrgDes) {
            return res.status(400).json({ message: "Organisation name and description are required" });
        }
        const newOrganisation = new Organisation({
            OrgName,
            OrgDes,
            CreatedBy: user_Id
        });

        const savedOrganisation = await newOrganisation.save();

        res.status(201).json(savedOrganisation);
    } catch (error) {
        res.status(500).json({ message: "Error creating organisation", error: error.message });
    }
};

// Get all organisations by user ID
const getOrganisation = async (req, res) => {
    try {
        const { userId } = req.params;

        const organisations = await Organisation.find({ CreatedBy: userId }).populate('contexts');

        if (!organisations || organisations.length === 0) {
            return res.status(404).json({ message: 'No organizations found!' });
        }

        res.status(200).json(organisations);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving organizations', error: error.message });
    }
};

// Delete an organisation by organisation ID
const deleteOrganisation = async (req, res) => {
    try {
        const { OrgId } = req.params;

        if (!OrgId) {
            return res.status(400).json({ message: "Organisation ID is required" });
        }

        const deletedOrganisation = await Organisation.findOneAndDelete({ OrgId});

        if (!deletedOrganisation) {
            return res.status(404).json({ message: "Organisation not found or you do not have permission to delete this organisation" });
        }

        res.status(200).json({ message: "Organisation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting organisation", error: error.message });
    }
};

module.exports = { createOrganisation, getOrganisation, deleteOrganisation };
