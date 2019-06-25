/**
 * 「2010 年から 2015 年にかけて 10〜19 歳の人が増えた割合の都道府県ランキング」
 *  ==  lecture.  practice.  ◎application.  ==
 */

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
    const popuU14 = parseInt(columns[2]);
    const popuU19 = parseInt(columns[3]);
    const popu = popuU14 + popuU19;

    if (year === 2010 || year === 2015) {
        let value = prefecturesDataMap.get(prefectures);
        if (!value) {
            value = {
                popuY10: 0,
                popuY15: 0,
                change: null
            };
        }
        if (year === 2010) {
            value.popuY10 = popu;
        }
        if (year === 2015) {
            value.popuY15 = popu;
        }
        prefecturesDataMap.set(prefectures, value);
    }

});
rl.on('close', () => {
    for (let [key, value] of prefecturesDataMap) {
        value.change = value.popuY15 / value.popuY10;
    }
    const rankingArray = Array.from(prefecturesDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    const rankingString = rankingArray.map(([key, value],  i) => {
        return "第" + (i+1) + "位. " + key + ': ' + value.popuY10 + '=>' + value.popuY15 + '  変化率:' + value.change;
    });
    console.log(rankingString);
});
