require('babel-register')
// const qrcode = require('qrcode-terminal')
const fs = require('fs')
// const request = require('request')
const parseString = require('xml2js').parseString
const Wechat = require('wechat4u')
// const communication = require('./communication')
var mysql = require('mysql')
// var config = require('../config');
// var randomString = require('../common/common').randomString;
var moment = require('moment');
var wxbot = null;

module.exports = function (bot) {

    wxbot = bot;
    /**
     * 如何处理会话消息
    */

    bot.on('message', msg => {
        /**
         * 获取消息时间
         */
        console.log(`----------${msg.getDisplayTime()}-----${bot.contacts[msg.FromUserName].getDisplayName()}-----`)
        // 正式环境这行代码不要注释
        if (bot.contacts[msg.FromUserName].getDisplayName() != '小冰') {
            return;
        }
        /**
         * 判断消息类型
         */
        switch (msg.MsgType) {
            case bot.CONF.MSGTYPE_TEXT:
                /**
                 * 文本消息
                 */
                console.log(msg.Content);
                if (bot.contacts[msg.FromUserName].getDisplayName() == '小冰') {

                    if (global.waitMsgUser.length != 0) {
                        bot.sendMsg(msg.Content, global.waitMsgUser);
                    } else {
                        var cont = msg.Content.replace(/微软/g, '鱼跃');
                        cont = cont.replace(/小冰/g, '小鱼儿');
                        cont = cont.replace(/Microsoft/g, 'Cloudoc');
                        eventCenter.emit('restext', cont);
                    }
                } else {
                    bot.sendMsg(msg.Content, global.xiaobing);
                    global.waitMsgUser = msg.FromUserName;
                }
                break
            case bot.CONF.MSGTYPE_IMAGE:
                /**
                 * 图片消息
                 */
                console.log('图片消息，保存到本地')
                bot.getMsgImg(msg.MsgId).then(res => {
                    fs.writeFileSync(`./media/${msg.MsgId}.jpg`, res.data)
                }).catch(err => {
                    bot.emit('error', err)
                })
                if (bot.contacts[msg.FromUserName].getDisplayName() == '小冰') {

                    if (global.waitMsgUser.length != 0) {
                        bot.sendMsg('[图片消息]', global.waitMsgUser);
                    } else {

                        eventCenter.emit('restext', '[图片消息]');
                    }
                } else {
                    bot.sendMsg('[图片消息]', global.xiaobing);
                    global.waitMsgUser = msg.FromUserName;
                }
                break
            case bot.CONF.MSGTYPE_VOICE:
                /**
                 * 语音消息
                 */
                console.log('语音消息，保存到本地')
                bot.getVoice(msg.MsgId).then(res => {
                    fs.writeFileSync(`./media/${msg.MsgId}.mp3`, res.data)
                }).catch(err => {
                    bot.emit('error', err)
                })
                if (bot.contacts[msg.FromUserName].getDisplayName() == '小冰') {

                    if (global.waitMsgUser.length != 0) {
                        bot.sendMsg('[语音消息]', global.waitMsgUser);
                    } else {

                        eventCenter.emit('restext', '[语音消息]');
                    }
                } else {
                    bot.sendMsg('[语音消息]', global.xiaobing);
                    global.waitMsgUser = msg.FromUserName;
                }
                break
            case bot.CONF.MSGTYPE_EMOTICON:
                /**
                 * 表情消息
                 */
                console.log('表情消息，保存到本地')
                bot.getMsgImg(msg.MsgId).then(res => {
                    fs.writeFileSync(`./media/${msg.MsgId}.gif`, res.data)
                }).catch(err => {
                    bot.emit('error', err)
                })
                if (bot.contacts[msg.FromUserName].getDisplayName() == '小冰') {

                    if (global.waitMsgUser.length != 0) {
                        bot.sendMsg('[表情消息]', global.waitMsgUser);
                    } else {

                        eventCenter.emit('restext', '[表情消息]');
                    }
                } else {
                    bot.sendMsg('[表情消息]', global.xiaobing);
                    global.waitMsgUser = msg.FromUserName;
                }
                break
            case bot.CONF.MSGTYPE_VIDEO:
            case bot.CONF.MSGTYPE_MICROVIDEO:
                /**
                 * 视频消息
                 */
                console.log('视频消息，保存到本地')
                bot.getVideo(msg.MsgId).then(res => {
                    fs.writeFileSync(`./media/${msg.MsgId}.mp4`, res.data)
                }).catch(err => {
                    bot.emit('error', err)
                })
                if (bot.contacts[msg.FromUserName].getDisplayName() == '小冰') {

                    if (global.waitMsgUser.length != 0) {
                        bot.sendMsg('[视频消息]', global.waitMsgUser);
                    } else {

                        eventCenter.emit('restext', '[视频消息]');
                    }
                } else {
                    bot.sendMsg('[视频消息]', global.xiaobing);
                    global.waitMsgUser = msg.FromUserName;
                }
                break
            case bot.CONF.MSGTYPE_APP:
                if (msg.AppMsgType == 6) {
                    /**
                     * 文件消息
                     */
                    console.log('文件消息，保存到本地')
                    bot.getDoc(msg.FromUserName, msg.MediaId, msg.FileName).then(res => {
                        fs.writeFileSync(`./media/${msg.FileName}`, res.data)
                        console.log(res.type);
                    }).catch(err => {
                        bot.emit('error', err)
                    })
                }
                if (bot.contacts[msg.FromUserName].getDisplayName() == '小冰') {

                    if (global.waitMsgUser.length != 0) {
                        bot.sendMsg('[文件消息]', global.waitMsgUser);
                    } else {

                        eventCenter.emit('restext', '[文件消息]');
                    }
                } else {
                    bot.sendMsg('[文件消息]', global.xiaobing);
                    global.waitMsgUser = msg.FromUserName;
                }
                break
            default:
                break
        }
    })

    eventCenter.on('sendtext', function (msg) {


        bot.sendMsg(msg.content, xiaobing);
    });

}


function sendCommunicationMsg(bot, msg) {

    if (msg.isSendBySelf == true) {
        return;
    }
    var pool = mysql.createPool({
        host: config['dbhost'],
        user: config['dbuser'],
        password: config['dbpwd'],
        database: "BB",
        connectionLimit: 100,
        port: "3306",
        waitForConnections: false
    });

    var df = moment();
    pool.getConnection(function (err, connection) {

        if (!err) {
            connection.query("insert into wxmsg(content,fromusername,createtime,MsgType) values(?,?,?,?)", [msg.Content, msg.FromUserName, parseInt(msg.CreateTime), parseInt(msg.MsgType)], function (err, results, fields) {

                connection.release();
                if (err) {
                    console.error(err);
                }
                bot.sendMsg(`欢迎${bot.contacts[msg.FromUserName].getDisplayName()}回来,雯雯在这里等你好久咯`, msg.FromUserName);
                var msgStr = `雯雯:现有爱吧各 VIP 套餐如下:年卡(365天)--258元,包月卡(30天)--58元,在您转账成功后账号将会发给您,比如:您转账58元,稍后将会自动为您创建或者充值 VIP 包月套餐账户`;
                bot.sendMsg(msgStr, msg.FromUserName);
                bot.sendMsg(`雯雯保证账户长期有效,如果您有些疑虑,也可以先用体验卡,公司先推出7天VIP 体验卡,只需19.9元哟,一顿饭,一包烟的钱可以免费体验7天`, msg.FromUserName);
            });
        } else {
            console.error(err);
        }
    });
}

function notifySupportWithInfo(msg) {

    // wxbot.sendMsg(msg, "@e5588d1d843d690a496dcb16809f7b6d");
}