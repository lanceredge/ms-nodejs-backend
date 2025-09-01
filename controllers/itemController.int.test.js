const request = require('supertest');
const app = require('../app'); // Asegúrate de que `app.js` exporte la app de Express

describe('Item API', () => {
  beforeEach(() => {
    global.items = []; // Limpia los datos antes de cada test
  });

  it('should get all items', async () => {
    const response = await request(app).get('/api/items').expect(200);
    
    expect(response.body).toHaveProperty('metadata');
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('should get a single item by ID', async () => {
    const newItem = {
      name: 'JohnDoe',
      email: 'john.doe@example.com',
      registeredAt: '2025-05-18T12:00:00Z'
    };
    const createResponse = await request(app).post('/api/items').send(newItem).expect(201);

    const itemId = createResponse.body.newItem.id;

    const response = await request(app).get(`/api/items/${itemId}`).expect(200);
    
    expect(response.body).toHaveProperty('metadata');
    expect(response.body).toHaveProperty('item');
    expect(response.body.item).toMatchObject({
      id: itemId,
      name: newItem.name,
      email: newItem.email
    });
  });

  it('should create a new item', async () => {
    const newItem = {
      name: 'JaneDoe',
      email: 'jane.doe@example.com',
      registeredAt: '2025-05-18T12:00:00Z'
    };
    
    const response = await request(app)
      .post('/api/items')
      .send(newItem)
      .expect(201);

    expect(response.body).toHaveProperty('metadata');
    expect(response.body).toHaveProperty('newItem');
    expect(response.body.newItem.name).toBe(newItem.name);
    expect(response.body.newItem.email).toBe(newItem.email);
  });

  it('should update an existing item', async () => {
    const newItem = {
      name: 'ItemToUpdate',
      email: 'item.update@example.com',
      registeredAt: '2025-05-18T12:00:00Z'
    };
    const createResponse = await request(app).post('/api/items').send(newItem).expect(201);
    const itemId = createResponse.body.newItem.id;

    const updatedItem = {
      name: 'UpdatedItem',
      email: 'updated.item@example.com'
    };
    const response = await request(app)
      .put(`/api/items/${itemId}`)
      .send(updatedItem)
      .expect(200);

    expect(response.body.name).toBe(updatedItem.name);
    expect(response.body.email).toBe(updatedItem.email);
  });

  it('should delete an item', async () => {
    const newItem = {
      name: 'ItemToDelete',
      email: 'item.delete@example.com',
      registeredAt: '2025-05-18T12:00:00Z'
    };
    const createResponse = await request(app).post('/api/items').send(newItem).expect(201);
    const itemId = createResponse.body.newItem.id;

    await request(app).delete(`/api/items/${itemId}`).expect(204);
  });
});
