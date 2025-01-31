const mongoose = require('mongoose');
const { v4: uuidv4 } = require("uuid");


const NotesSchema = new mongoose.Schema({
    NoteId:{
        type: String,
        default: () => uuidv4() 

    },
    CreatedBy:{
        type: String,
        required: true
    },
    NotesDescription:{
        type: String,   
        required: true
    },
},{
    timestamps:true
})

module.exports = mongoose.model("Notes",NotesSchema);