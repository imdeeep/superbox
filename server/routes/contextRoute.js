const express = require('express'); 
const router = express.Router();
const {
    newContext,
    getTempContext,
    getOrgContexts,
    tempContext,
    getTempContextsByUser,
    getAllContextsByUser,
    deleteContext
} = require('../controllers/contextController');

// Routes
router.post('/continue', newContext);
router.post('/temp', tempContext);
router.get('/contexts', getOrgContexts);
router.get('/tempcontext', getTempContext);
router.get('/tempcontexts/:userId', getTempContextsByUser);
router.get('/allcontexts/:userId', getAllContextsByUser);
router.delete('/delete/:contextId', deleteContext);





module.exports = router;
