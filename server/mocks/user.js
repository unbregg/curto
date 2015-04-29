module.exports = function (app) {
  var express = require('express');
  var userRouter = express.Router();

  userRouter.post('/bulkCreate', function (req, res) {
    res.send({
      'userModels':req.body
    });
  });

  userRouter.put('/bulkUpdate',function(req,res){
    req.body.forEach(function(user){
      user.name='processed';
    });
    res.send({
      'userModels':req.body
    });
  });

  userRouter.get('/', function (req, res) {
    res.send({
      'users': []
    });
  });

  userRouter.post('/', function (req, res) {
    res.status(201).end();
  });

  userRouter.get('/:id', function (req, res) {
    res.send({
      'user': {
        id: req.params.id
      }
    });
  });

  userRouter.put('/:id', function (req, res) {
    res.send({
      'user': {
        id: req.params.id
      }
    });
  });

  userRouter.delete('/:id', function (req, res) {
    res.status(204).end();
  });

  app.use('/userModels', userRouter);
};
