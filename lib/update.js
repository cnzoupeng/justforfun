"use strict"
let cheerio = require('cheerio');
let http = require('http');
let fs = require('fs');
let request = require('request');
let util = require('util');
let logger = require('./base').logger;

let hisFile = './data/history.json';


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

        let red = [];
        for(let i = 0; i < 6; ++i){
            red.push(one.red.substr(i * 2, 2));            
        }
        one.red = red.sort();
        out.push(one);
    });
    return out;
}

function update(onUpdateCall){

    let options = {
        url: "http://baidu.lecai.com/lottery/draw/list/50?type=range&start=2003001&end=2019087",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Cache-Control': 'max-age=0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36',
            "Cookie": "_lcas_uuid=1501502471; _lcas_uuid=1501502471; _adwp=110406678.3715290679.1469346514.1475383196.1481631384.9; _adwc=110406678; _adwr=110406678%230; _lhc_uuid=sp_584fe69aecc4c9.40080748; lehecai_request_control_stats=2; _adwb=110406678; Hm_lvt_6c5523f20c6865769d31a32a219a6766=1481631387; Hm_lpvt_6c5523f20c6865769d31a32a219a6766=1481631447; Hm_lvt_9b75c2b57524b5988823a3dd66ccc8ca=1481631387; Hm_lpvt_9b75c2b57524b5988823a3dd66ccc8ca=1481631447",
            "Referer": "http://baidu.lecai.com/lottery/draw/list/50?type=range&start=2003001&end=2019087"
        }
    };

    request(options, function(err, res, body){
        if(err || res.statusCode != 200){
            logger.error(`Update http code=${res.statusCode} error ${err}`);
            lastUpdateDay = 0;
            return;
        }
        
        var newHis = parse(body);
        console.log(newHis[0])
        if(!newHis){
            logger.error('parse body Failed');
            return;
        }

        if(newHis.length > 0){
            fs.writeFileSync(hisFile, JSON.stringify(newHis, null, 4));
            logger.info('last history found ' + newHis[0].id);
            if(onUpdateCall){
                onUpdateCall();
            }
        }
    });
}


module.exports = {
    run: update
}
