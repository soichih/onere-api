var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/onero');

var Dset = mongoose.model('dataset', { id:Number, name:String, location:String, date:Date, creator:String });

var dset1 = new Dset({ id:3, name:'dataSet3', location:'ftp://a.b.c', date:2016-08-16, creator:'Chathuri Peli' });
dset1.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Data saved');
  }
});
