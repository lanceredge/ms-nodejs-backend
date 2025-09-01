// models/itemModel.js
const { faker } = require('@faker-js/faker');

let items = [];

/**
 * Genera items fake
 */
function generateFakeItems(count = 10) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.internet.username(),
    email: faker.internet.email(),
    registeredAt: faker.date.past()
  }));
}

/**
 * Devuelve todos los items, genera si está vacío
 */
function getAll() {
  if (items.length === 0) {
    items = generateFakeItems(10);
  }
  return items;
}

/**
 * Busca un item por id
 */
function getById(id) {
  return items.find(i => i.id === id);
}

/**
 * Crea un item nuevo
 */
function create(data) {
  const newItem = { id: faker.string.uuid(), ...data };
  items.push(newItem);
  return newItem;
}

/**
 * Actualiza un item por id
 */
function update(id, data) {
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...data };
  return items[index];
}

/**
 * Elimina un item por id
 */
function remove(id) {
  const initialLength = items.length;
  items = items.filter(i => i.id !== id);
  return items.length < initialLength;
}

/**
 * Utilidad para tests: resetear items
 */
function reset(newItems = []) {
  items = newItems;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  reset
};
