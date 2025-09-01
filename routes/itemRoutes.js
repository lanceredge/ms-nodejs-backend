const express = require('express');
const router = express.Router();
const controller = require('../controllers/itemController');

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Item management
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items
 */
router.get('/', controller.getAllItems);

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Single item
 */
router.get('/:id', controller.getItem);

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Item created
 */
router.post('/', controller.createItem);

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 */
router.put('/:id', controller.updateItem);

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 */
router.delete('/:id', controller.deleteItem);

module.exports = router;
