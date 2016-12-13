"use strict"
let cheerio = require('cheerio');
let http = require('http');
let fs = require('fs');
let request = require('request');
let util = require('util');
let logger = require('./base').logger;

let timerInterval = 60000;
let hisFile = '../data/history.json';
let lastUpdateDay = 0;
let onUpdateCall = null;


function padRight(n, width) {
  n = n + '                ';
  return n.substr(0, width);
}

function parse(html){
    let out = [];
    let cheer = cheerio.load(html);
    cheer('.historylist > tbody > tr').each(function(i, e){
        let subch = cheerio.load(cheer(this).html());
        let one = {};
        one.id = subch('a').text();
        one.red = subch('.redBalls').text().replace(/[^0-9]/ig,"");
        one.blue = subch('.blueBalls').text().replace(/[^0-9]/ig,"");

        //console.log(subch('.NotNumber'))
        //one.count1 = parseInt(subch('.NotNumber')[0]['children'][0]['data']);
        //one.cash1 = parseInt(subch('.cash')[0]['children'][0]['data']);
        //one.count2 = parseInt(subch('.NotNumber')[1]['children'][0]['data']);
        //one.cash2 = parseInt(subch('.cash')[1]['children'][0]['data']);
        //one.allRed = parseInt(one.count1) + parseInt(one.count2);

        let red = [];
        for(let i = 0; i < 6; ++i){
            red.push(one.red.substr(i * 2, 2));            
        }
        one.red = red;
        out.push(one);
    });
    return out;
}

function update(){
    let dt = new Date();
    if(dt.getHours() == 23 && dt.getDate() != lastUpdateDay){
        logger.info("start update");
        lastUpdateDay = dt.getDate();
    }
    else{
       return;
    }

    let options = {
        url: "http://baidu.lecai.com/lottery/draw/list/50?type=range&start=2003001&end=2019087",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Cache-Control': 'max-age=0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36'
        }
    };

    request(options, function(err, res, body){
        if(err || res.statusCode != 200){
            logger.error(`Update http code=${res.statusCode} error ${err}`);
            lastUpdateDay = 0;
            return;
        }
        
        var newHis = parse(body);
        if(!newHis){
            logger.error('parse body Failed');
            return;
        }

        let oldString = fs.readFileSync(hisFile).toString();
        let old = JSON.parse(oldString);
        if(old[0].id != newHis[0].id && newHis.length >= (old.length / 2)){
            fs.writeFileSync(hisFile, JSON.stringify(newHis, null, 4));
            logger.info('new history found ' + newHis[0].id);
            if(onUpdateCall){
                onUpdateCall();
            }
        }
    });
}

function start(call){
    onUpdateCall = call;
    setInterval(update, timerInterval);
}

module.exports = start();
