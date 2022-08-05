const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// create, find, update, delete
router.get('/', userController.view)  // first route using user controller --> view the data of the user
router.post('/', userController.find)   // find the user by search

router.get('/adduser', userController.form)
router.post('/adduser', userController.create)
router.get('/edituser/:id', userController.renderEdit)
router.post('/edituser/:id', userController.update)
router.get('/viewuser/:id', userController.viewuser)
router.get('/:id', userController.deleteUser)
module.exports = router;