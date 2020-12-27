var express = require('express');
var db=require('../select');
//const { route } = require('./LoginRoutes');
var router = express.Router();
router.get('/',(req,res)=>{
res.render('./cart/cart')
});
module.exports = router;