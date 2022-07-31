const express = require('express')
const router = express.Router()
const blogControllers = require('../controllers/blog')

router.route('/')
      .get(blogControllers.getAll)
      .post(blogControllers.create)

router.route('/:id')
      .get(blogControllers.getSingle)
      .put(blogControllers.update)
      .delete(blogControllers.deleteSingle)
module.exports = router;