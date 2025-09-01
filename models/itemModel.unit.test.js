const itemModel = require('./itemModel');

beforeEach(() => {
  itemModel.reset();
});

test('create() debería añadir un nuevo item', () => {
  const newItem = { name: 'Jane', email: 'jane@test.com', registeredAt: '2025-01-01' };
  const created = itemModel.create(newItem);

  expect(created).toMatchObject(newItem);
  expect(itemModel.getAll()).toContainEqual(created);
});

test('getById() debería devolver el item correcto', () => {
  const newItem = { name: 'John', email: 'john@test.com', registeredAt: '2025-01-01' };
  const created = itemModel.create(newItem);

  const found = itemModel.getById(created.id);
  expect(found).toEqual(created);
});

test('update() debería modificar un item existente', () => {
  const created = itemModel.create({ name: 'Old', email: 'old@test.com', registeredAt: '2025-01-01' });
  const updated = itemModel.update(created.id, { name: 'New' });

  expect(updated.name).toBe('New');
});

test('remove() debería eliminar un item', () => {
  const created = itemModel.create({ name: 'DeleteMe', email: 'del@test.com', registeredAt: '2025-01-01' });
  const removed = itemModel.remove(created.id);

  expect(removed).toBe(true);
  expect(itemModel.getById(created.id)).toBeUndefined();
});
