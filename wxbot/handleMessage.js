require('babel-register')
const fs = require('fs')
const parseString = require('xml2js').parseString
const Wechat = require('wechat4u')
var mysql = require('mysql')
const newspaper = require("../src/brain/newspaper")
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
                    } 
                } else {
                    links = pitchLinkFromContent(msg.Content)
                    if (links.length != 0) {

                        mp3url = []
                        for (var link in links) {
                            mp3url = newspaper(link)
                        }
                        bot.sendMsg(mp3url,msg.FromUserName)
                    } else {
                        bot.sendMsg(msg.Content, global.xiaobing);
                        global.waitMsgUser = msg.FromUserName;
                    }
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

}


function notifySupportWithInfo(msg) {

    // wxbot.sendMsg(msg, "@e5588d1d843d690a496dcb16809f7b6d");
}

function pitchLinkFromContent(content) {
    str = /(http:\/\/|https:\/\/|www)((\w|=|\?|\.|\/|&|-)+)/g
    return content.match(str)
}

// content = "欢迎访问我的个人网站：http://www.zhangxinxu.com/欢迎访问我的个人网站：https://www.zhangxinxu.com/欢迎访问我的个人网站：www.zhangxinxu.com/";
// str = /(http:\/\/|https:\/\/|www)((\w|=|\?|\.|\/|&|-)+)/g

// console.log("jieguo:" + content.match(str))