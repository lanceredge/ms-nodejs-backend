const express = require('express');
const bodyParser = require('body-parser');
const { getAllItems, getItem, createItem, updateItem, deleteItem } = require('./controllers/itemController');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// const itemRoutes = require('./routes/itemRoutes');
//


app.use(bodyParser.json());

// Rutas
app.get('/api/items', getAllItems);
app.get('/api/items/:id', getItem);
app.post('/api/items', createItem);
app.put('/api/items/:id', updateItem);
app.delete('/api/items/:id', deleteItem);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/home', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 80;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;  // Exporta la app para las pruebas
