'use strict';
const fs = require('fs');
const readline = require('readline');

const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output': {} });

const prefecturesDataMap = new Map();      //  key: 都道府県   value: 集計データのオブジェクト

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefectures = columns[1];
    const popu = parseInt(columns[3]);

    if (year === 2010 || year === 2015) {
        let value = prefecturesDataMap.get(prefectures);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefecturesDataMap.set(prefectures, value);
    }

});
rl.on('close', () => {
    for (let [key, value] of prefecturesDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    console.log(prefecturesDataMap);
});
