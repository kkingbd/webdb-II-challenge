const express    = require('express');
const helmet     = require('helmet');
const knex       = require('knex');
const knexConfig = require('./knexfile.js');
const server     = express();
server.use(express.json());
server.use(helmet());
const db         = knex(knexConfig.development);
// endpoints here
server.get('/', (req, res) => {
  res.send('Success');
});
// Listing zoos
server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
// Listing zoos by id
server.get('/api/zoos/:id', (req, res) => {
  const roleId = req.params.id;

  db('zoos')
    .where({ id: roleId })
    .first()
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
// Posting new animal in the zoo
server.post('/api/zoos', (req, res) => {
  // get back an array with the last id generated: [ 3 ]
  db('zoos')
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db('zoos')
        .where({ id })
        .first()
        .then(role => {
          res.status(201).json(role);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// update an animal by id
server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
/// Delete the dead one by id
server.delete("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(value => {
      res.status(200).json(value);
    })
    .catch(err => res.status(500).json(err));
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
