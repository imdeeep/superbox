const Notes = require('../models/notesModal');

const createNotes = async (req, res) => {
    const { CreatedBy, NotesDescription } = req.body;
    try {
        const newNotes = new Notes({
            CreatedBy,
            NotesDescription
        });
        const savedNotes = await newNotes.save();
        res.status(200).json({ message: "Notes created successfully" , savedNotes});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}    

const getNotes = async (req, res) => {
    const userId = req.params.userId;
    try {
        const notes = await Notes.find({ CreatedBy: userId });
        if (!notes) {
            return res.status(404).json({ message: "Notes not found" });
        }
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteNotes = async (req, res) => {
    const notesId = req.params.notesId;
    try {
        const deletedNotes = await Notes.findOneAndDelete({ NoteId: notesId });
        if (!deletedNotes) {
            return res.status(404).json({ message: "Notes not found or you do not have permission to delete this notes" });
        }
        res.status(200).json({ message: "Notes deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { createNotes, getNotes, deleteNotes };
