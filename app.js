"use strict"

let up = require('./lib/update');
let calc = require('./lib/calc')

/*
up.run(function(){
  console.log('done')
});
*/

var arr = [
  ['03', '05', '15', '16', '27', '30'],
  ['02', '09', '15', '16', '27', '30'],
  ['03', '08', '16', '17', '27', '30'],
  ['04', '05', '15', '16', '22', '30'],
  ['02', '05', '15', '16', '23', '29']
]

calc.notInhist(arr);