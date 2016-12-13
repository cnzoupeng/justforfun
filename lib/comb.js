'use strict'

function getFlagArrs(m, n) {
    if(!n || n < 1) {
        return [];
    }
    let resultArrs = [],
        flagArr = [],
        isEnd = false,
        i, j, leftCnt;
 
    for (i = 0; i < m; i++) {
        flagArr[i] = i < n ? 1 : 0;
    }
    resultArrs.push(flagArr.concat());
 
    while (!isEnd) {
        leftCnt = 0;
        for (i = 0; i < m - 1; i++) {
            if (flagArr[i] == 1 && flagArr[i+1] == 0) {
                for(j = 0; j < i; j++) {
                    flagArr[j] = j < leftCnt ? 1 : 0;
                }
                flagArr[i] = 0;
                flagArr[i+1] = 1;
                let aTmp = flagArr.concat();
                resultArrs.push(aTmp);
                if(aTmp.slice(-n).join("").indexOf('0') == -1) {
                    isEnd = true;
                }
                break;
            }
            flagArr[i] == 1 && leftCnt++;
        }
    }
    return resultArrs;
}

function mcn(arr, n){
    let m = arr.length;
    let flags = getFlagArrs(m, n);

    let result = [];
    for(let i in flags){
        let one = []
        for(let j = 0; j < m; j++){
            if(flags[i][j] == 1){
                one.push(arr[j]);
            }
            if(one.length == n){
                break;
            }
        }
        result.push(one);
    }
    return result;
}

function mcnNum(m, n){
    let arr = [];
    for(var i = 1; i <= m; ++i){
        arr.push(i);
    }
    return mcn(arr, n);
}


module.exports = {
    mcn: mcn,
    mcnNum: mcnNum
}