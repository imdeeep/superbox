const Context = require('../models/contextModel');
const Organisation = require('../models/orgModel');
const { chunkContext } = require('../utils/contextRefine');
const { generateTitle } = require('../utils/titleGenerator');

// Create a new context (temporary or non-temporary)
const newContext = async (req, res) => {
    const { oldContext, title, orgId, temporary ,userId } = req.body;

    if (!oldContext) {
        return res.status(400).json({ message: 'oldContext is required!' });
    }

    if (!temporary && !orgId) {
        return res.status(400).json({ message: 'orgId is required for non-temporary contexts!' });
    }

    try {
        // Generate a refined context
        const refinedContext = await chunkContext(oldContext);

        const generatedTitle =  await generateTitle(refinedContext) || title 

        const context = new Context({
            oldContext,
            refineContext: refinedContext,
            title: generatedTitle,
            orgId: temporary ? undefined : orgId,
            temporary: !!temporary,
            createdBy: userId
        });

        await context.save();   

        if (!temporary) {
            // Add the context to the organization's `contexts` array
            await Organisation.findByIdAndUpdate(
                orgId,
                { $push: { contexts: context._id } },
                { new: true }
            );
        }

        res.status(201).json(context);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

// Create a temporary context
const tempContext = async (req, res) => {
    const { oldContext, title , userId} = req.body;

    // Validate required fields
    if (!oldContext || !title) {
        return res.status(400).json({ message: 'oldContext and title are required for temporary context!' });
    }

    try {
        // Refine the context
        const refinedContext = await chunkContext(oldContext);
        const generatedTitle =  await generateTitle(refinedContext) || title 

        // Create a temporary context
        const context = new Context({
            oldContext,
            refineContext: refinedContext,
            title: generatedTitle,
            temporary: true,
            createdBy: userId
        });

        await context.save();
        res.status(201).json(context);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

// Get all contexts for an organization (non-temporary)
const getOrgContexts = async (req, res) => {
    const { orgId } = req.query; 

    if (!orgId) {
        return res.status(400).json({ message: 'orgId is required!' });
    }

    try {
        // Fetch all contexts linked to the organization
        const contexts = await Context.find({ orgId, temporary: false });

        if (!contexts || contexts.length === 0) {
            return res.status(404).json({ message: 'No contexts found for this organization!' });
        }

        res.status(200).json(contexts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

// Get all temporary contexts
const getTempContext = async (req, res) => {
    try {
        const tempContexts = await Context.find({ temporary: true });

        if (!tempContexts || tempContexts.length === 0) {
            return res.status(404).json({ message: 'No temporary contexts found!' });
        }

        res.status(200).json(tempContexts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

// Get all temporary contexts created by a user
const getTempContextsByUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'userId is required!' });
    }

    try {
        const tempContexts = await Context.find({ temporary: true, createdBy: userId });

        if (!tempContexts || tempContexts.length === 0) {
            return res.status(404).json({ message: 'No temporary contexts found for this user!' });
        }

        res.status(200).json(tempContexts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

// Get a specific context by ID
const getContext = async (req, res) => {
    const { contextId } = req.params;

    if (!contextId) {
        return res.status(400).json({ message: 'contextId is required!' });
    }

    try {
        const context = await Context.findById(contextId);

        if (!context) {
            return res.status(404).json({ message: 'Context not found!' });
        }

        res.status(200).json(context);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

// Get all contexts created by a user
const getAllContextsByUser = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'userId is required!' });
    }

    try {
        // Fetch all contexts created by the user
        const contexts = await Context.find({ createdBy: userId });

        if (!contexts || contexts.length === 0) {
            return res.status(404).json({ message: 'No contexts found for this user!' });
        }

        res.status(200).json(contexts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};

const deleteContext = async (req, res) => {
    const { contextId } = req.params;

    if (!contextId) {
        return res.status(400).json({ message: 'contextId is required!' });
    }

    try {
        // Find and delete using contextId (UUID) instead of _id
        const deletedContext = await Context.findOneAndDelete({ contextId });

        if (!deletedContext) {
            return res.status(404).json({ message: 'Context not found!' });
        }

        // Update organization if needed
        if (!deletedContext.temporary && deletedContext.orgId) {
            await Organisation.findByIdAndUpdate(
                deletedContext.orgId,
                { $pull: { contexts: deletedContext.contextId } } // Use contextId here too
            );
        }

        res.status(200).json({ message: 'Context deleted successfully!', deletedContext });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
};


module.exports = {
    newContext,
    tempContext,
    getOrgContexts,
    getTempContext,
    getTempContextsByUser,
    getContext,
    getAllContextsByUser,
    deleteContext
};
