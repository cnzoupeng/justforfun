"use strict"
const fs = require("fs");

const ruleFile = "./data/rule.json";
var rule = {};

const baseFile = "./data/base.json";
let base = {};

const hisFile = "./data/history.json";
let history = {};

class Lott{
    constructor(red){
        this.red = red;
        this.sum = 0;
        this.tailCount = 0;
        this.oushu = 0;
        this.distance = red[5] - red[0];
        this.lianhao = 1;
        this.lianhaoMax = 1;

        let lhTmp = 1;
        let map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for(let i in red){
            this.sum += red[i];
            map[red[i] % 10] = 1;
            this.oushu += red[i] % 2 ? 0 : 1;
        }

        for(let i = 1; i < 6; ++i){
            if(red[i] == red[i - 1] + 1){
                lhTmp++;
            }
            else{
                if(lhTmp > this.lianhaoMax){
                    this.lianhaoMax = lhTmp;
                }
                if(lhTmp > 1){
                    this.lianhao ++;
                }
                lhTmp = 1;
            }
        }
        if(lhTmp > this.lianhaoMax){
            this.lianhaoMax = lhTmp;
        }
        for(let i in map){
            if(map[i] > 0){
                this.tailCount ++;
            }
        }
    }
}

function notInHistory(arr){
    history = JSON.parse(fs.readFileSync(hisFile).toString());

    var arrT = [];
    for(var i in arr){
        arrT.push(arr[i].sort().join(' '));
    }

    var set = new Map();
    for(var i in history){
        set.set(history[i].red.join(' '), history[i].id);
    }


    for(var i in arrT){
        if(set.has(arrT[i])){
            console.log('Found ' + arrT[i] + ' ' + set.get(arrT[i]));
        }
        
    }
    console.log('done')
}

function run(){
    rule = JSON.parse(fs.readFileSync(ruleFile).toString());
    history = JSON.parse(fs.readFileSync(hisFile).toString());
    base = JSON.parse(fs.readFileSync(baseFile).toString());

    let arr = [];

    for(var i in base){
        arr.push(new Lott(base[i]));
    }
    console.log('done')
}


module.exports = {
    notInhist: notInHistory
};
