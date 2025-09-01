// controllers/itemController.js
const { injectSecrets } = require('../libs/secrets');
const itemModel = require('../models/itemModel');

let secretsLoaded = false;
const initPromise = (async () => {
  if (!secretsLoaded) {
    await injectSecrets();
    secretsLoaded = true;
  }
})();
async function ensureSecretsLoaded() {
  await initPromise;
}

// GET /api/items
exports.getAllItems = async (req, res) => {
  await ensureSecretsLoaded();
  const items = itemModel.getAll();

  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  res.json({
    metadata: {
      provider: process.env.API_PROVIDER_URL || 'localhost'
    },
    items
  });
};

// GET /api/items/:id
exports.getItem = async (req, res) => {
  await ensureSecretsLoaded();
  const item = itemModel.getById(req.params.id);

  res.setHeader('Content-Type', 'application/json');
  if (item) {
    res.json({
      metadata: {
        provider: process.env.API_PROVIDER_URL || 'localhost'
      },
      item
    });
  } else {
    res.status(404).send('Item not found');
  }
};

// POST /api/items
exports.createItem = async (req, res) => {
  await ensureSecretsLoaded();
  const { name, email, registeredAt } = req.body;

  if (!name || !email || !registeredAt) {
    res.status(400).send('Missing required fields: name, email, or registeredAt');
    return;
  }

  const newItem = itemModel.create(req.body);

  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
    metadata: {
      provider: process.env.API_PROVIDER_URL || 'localhost'
    },
    newItem
  });
};

// PUT /api/items/:id
exports.updateItem = async (req, res) => {
  await ensureSecretsLoaded();
  const updated = itemModel.update(req.params.id, req.body);

  if (updated) {
    res.setHeader('Content-Type', 'application/json');
    res.json(updated);
  } else {
    res.status(404).send('Item not found');
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  await ensureSecretsLoaded();
  const deleted = itemModel.remove(req.params.id);

  res.setHeader('Content-Type', 'application/json');
  res.status(deleted ? 204 : 404).send();
};
