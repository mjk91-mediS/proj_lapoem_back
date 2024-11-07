const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.patch('/community/:postId', communityController.updateCommunityPost);

module.exports = router;
