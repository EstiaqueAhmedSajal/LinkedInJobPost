const express = require('express');
const fs = require('fs');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const dataPath = './data.json';

// Get all items
app.get('/items', (req, res) => {

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to fetch items', err);
            res.status(500).json({ error: 'Failed to fetch items' });
            return;
        }
        const items = JSON.parse(data);
        res.json(items);
    });
});

// Create a new item
app.post('/items', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to create item', err);
            res.status(500).json({ error: 'Failed to create item' });
            return;
        }
        const items = JSON.parse(data);
        const newItem = req.body;
        items.push(newItem);
        fs.writeFile(dataPath, JSON.stringify(items), (err) => {
            if (err) {
                console.error('Failed to create item', err);
                res.status(500).json({ error: 'Failed to create item' });
                return;
            }
            res.status(201).json(newItem);
        });
    });
});

// Update an item
app.put('/items/:id', (req, res) => {
    
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to update item', err);
            res.status(500).json({ error: 'Failed to update item' });
            return;
        }
        const items = JSON.parse(data);
    });
        const itemId = req.params.id;
        const updatedItem = req.body;

        // Find the item with the matching ID
      const itemToUpdate = items.find(item => item.SL === Number(itemId));
      if (!itemToUpdate) {
        return res.status(404).json({ error: 'Item not found' });
      }
        // Update the properties of the item
      itemToUpdate.posted_date = updatedItem.posted_date;
      itemToUpdate.closing_date = updatedItem.closing_date;
      itemToUpdate.daily_budget = updatedItem.daily_budget;
      itemToUpdate.action = updatedItem.action;

        fs.writeFile(dataPath, JSON.stringify(items), (err) => {
            if (err) {
                console.error('Failed to update item', err);
                res.status(500).json({ error: 'Failed to update item' });
                return;
            }
            res.json(updatedItem);
        });

});

// Delete an item
app.delete('/items/:id', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to delete item', err);
            res.status(500).json({ error: 'Failed to delete item' });
            return;
        }
        const items = JSON.parse(data);
        const itemId = req.params.id;
        const updatedItems = items.filter(item => item.id !== itemId);
        fs.writeFile(dataPath, JSON.stringify(updatedItems), (err) => {
            if (err) {
                console.error('Failed to delete item', err);
                res.status(500).json({ error: 'Failed to delete item' });
                return;
            }
            res.sendStatus(204);
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
