/*global describe, it*/
// 'use strict'; 
const request_koa = require("../../common/request_koa.js")
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path')


const text2speech = async(text) => {

    var ttsPath = path.resolve(__dirname, 'text2speech.py')
    var cmd = `export WORKON_HOME=~/Envs && source /usr/local/bin/virtualenvwrapper.sh && workon scrapyd_py3.6.1 && python -V && python ${ttsPath} "${text}"`
    const defaults = {
        encoding: 'utf-8',
        timeout: 0,
        maxBuffer: 2000 * 1024,
        killSignal: 'SIGTERM',
        cwd: null,
        env: null
    };

    const {
        stdout,
        stderr
    } = await exec(cmd, defaults);

    console.log('stderr:', stderr);
    if (stderr.length == 0) {
        console.log('stdout:', stdout);
        result = stdout.split('~~~~------follow result:~~~~~~~------')
        if (result.length == 2) {
            res = JSON.parse(result[1])['audio']
            return res
        } else {
            console.error("输出结果解析失败")
            return ""
        }
    } else {
        console.error(stderr)
        return ""
    }
}

module.exports = text2speech;