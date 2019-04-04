// implement your API here

require('dotenv').config();

const express = require('express'); // import the express package
// equilalent to import express from 'express'

const db = require('./data/db.js'); 

require('dotenv').config();

const port = process.env.PORT || 5000

// Middleware
const server = express(); // creates the server

server.use(express.json()); // addd this to make POST & PUT work 
// teaches express how to parse JSon to body

// Endpoints
server.get('/', (req, res) => {
    // Name (req, res) is not important culd be anything, position is important
    res.send('Hello World!')
    // .send() is a helper method that is part of the response object.
});

// write a get now endpoint that returns the date & time as a string
server.get('/now', (req, res) => {
    const time = new Date().toISOString();
    res.send(time);
});

// the R in CRUDS (Read)
server.get('/users', (req, res) => {
    db
    .find()
    .then (users => {
     res.status(200).json(users);   
    })
    .catch(error => {
        res.status(500).json({error: "The users information could not be retrieved." })
    })
});



// the C in CRUDS (Create)
// server.post('/users', (req, res) => {
    // one way a client can send info is in the request body
//     const userInfo = req.body; // Need to use express.json() middleware
//     console.log('user information', userInfo);

//   db.users
//     .add(userInfo)
//     .then(user => {
//         // user was added sucessfully
//         res.status(201).json(user);
//     })
//     .catch(error => {
//         // we ran into an error adding a user,
//         // Notice we are destructuring the error sent back by the data layer (db.js)
//         res.status(500).json({ message: 'error creating the user' });
//     });  
// }); 

server.post('/users', (req, res) => {
    // one way a client can send info is in the request body
    const userInfo = req.body; // Need to use express.json() middleware

    db
    .insert(userInfo)
    .then(user => {
        // user was added successfully
        res.status(201).json({ success: true, user })
    })
    .catch(({ code, message }) => {
        // We ran into an error adding a user
        // Notice we are destructuring the error sent back by the data layer. 
        res.status(code).json({
            success: false,
            message,
        })
    })
})




server.delete('/users/:id', (req, res) => {
    
    const id = req.params.id

    db
     .remove(id)
     .then(deleted => {
         // the data layer returns the deleted request, but we can't see it.
         // .end() ends the request and sends a response with the specified status code
         // 204 is (no content) it's commonly used for DELETE as there is no need to send anything back. 
         res.status(204).end();
     })
     .catch(({ code, message }) => {
         res.status(code).json({
             success: false,
             message,
         })
     })
     
})

//comment


server.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db
     .update(id, changes)
     .then(updated => {
         if (updated) {
             res.status(200).json({ success: true, updated })
         } else {
             res.status(404).json({
                 success: false,
                 message: 'Cannot find the user with the specified ID'
             })
         }
     })

     .catch(({ code, message }) => {
         res.status(code).json({
             success: false,
             message,
         })
     })
})





server.get('/users/:id', (req, res) => {
    db
     .findById(req.params.id)
     .then(user => {
         if (user) {
             res.status(200).json({
                success: true,
                user

             })
         } else {
             res.status(404).json({
                 success: false,
                 message: 'We cannot find that user!'
             })
         }
     })
     .catch(({ code, message }) => {
        res.status(code).json({
          success: false,
          message,
        });
      });
  });

// watch for connections on port 8000
// make the web server listen for incoming traffic on port 4000
server.listen(port, () =>
    // this callback function runs after the server starts successfully.
  console.log(`\n Server running on http://localhost:${port}`)
);



