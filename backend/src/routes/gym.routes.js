const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const {
  createGym,
  getGym,
  updateGym,
  deleteGym,
  listGyms,
} = require('../controllers/gym.controller');

const router = express.Router();

// All gym routes require authentication
router.use(authenticate);

// GET /api/gyms - List user's gyms
router.get('/', listGyms);

// POST /api/gyms - Create new gym
router.post('/', createGym);

// GET /api/gyms/:id - Get gym by ID
router.get('/:id', getGym);

// PUT /api/gyms/:id - Update gym
router.put('/:id', updateGym);

// DELETE /api/gyms/:id - Delete gym
router.delete('/:id', deleteGym);

module.exports = router;
