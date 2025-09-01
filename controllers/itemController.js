// controller/itemController.js
const { faker } = require('@faker-js/faker');
const { injectSecrets } = require('../libs/secrets');

let secretsLoaded = false;

// Promesa para inicializar secretos solo una vez (en cold start)
const initPromise = (async () => {
  if (!secretsLoaded) {
    await injectSecrets();
    secretsLoaded = true;
  }
})();

// Middleware/función para asegurarnos que los secretos están listos
async function ensureSecretsLoaded() {
  await initPromise;
}

let items = [];

// Generar datos fake si está vacío
function generateFakeItems(count = 10) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.internet.username(),
    email: faker.internet.email(),
    registeredAt: faker.date.past()
  }));
}

// Endpoint: GET /api/items
exports.getAllItems = async (req, res) => {
  await ensureSecretsLoaded();

  if (items.length === 0) {
    items = generateFakeItems(10);
  }

  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  res.json({
    metadata: {
      provider: process.env.API_PROVIDER_URL || 'localhost'
    },
    items
  });
};

// Endpoint: GET /api/items/:id
exports.getItem = async (req, res) => {
  await ensureSecretsLoaded();

  const item = items.find(i => i.id === req.params.id);
  
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

// Endpoint: POST /api/items
exports.createItem = async (req, res) => {
  await ensureSecretsLoaded();

  const newItem = { id: faker.string.uuid(), ...req.body };
  if (!newItem.name || !newItem.email || !newItem.registeredAt) {
    res.status(400).send('Missing required fields: name, email, or registeredAt');
    return;
  }
  items.push(newItem);
  
  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
    metadata: {
      provider: process.env.API_PROVIDER_URL || 'localhost'
    },
    newItem
  });
};

// Endpoint: PUT /api/items/:id
exports.updateItem = async (req, res) => {
  await ensureSecretsLoaded();

  const index = items.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };

    res.setHeader('Content-Type', 'application/json');
    res.json(items[index]);
  } else {
    res.status(404).send('Item not found');
  }
};

// Endpoint: DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  await ensureSecretsLoaded();

  const initialLength = items.length;
  items = items.filter(i => i.id !== req.params.id);
  const deleted = items.length < initialLength;

  res.setHeader('Content-Type', 'application/json');
  res.status(deleted ? 204 : 404).send();
};
