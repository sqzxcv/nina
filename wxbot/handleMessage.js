// require('babel-register')
const fs = require('fs')
const parseString = require('xml2js').parseString
const Wechat = require('wechat4u')
var mysql = require('mysql')
const audioConvertFromURLs = require("../src/brain/newspaper")
var moment = require('moment');
const util = require('util');
const xmlparseString = util.promisify(require('xml2js').parseString)
const config = require("../config")
var wxbot = null;

const handMsg = (bot) => {

    wxbot = bot;
    /**
     * 如何处理会话消息
     */

    bot.on('message', async msg => {
        /**
         * 获取消息时间
         */
        console.log(`----------${msg.getDisplayTime()}-----${bot.contacts[msg.FromUserName].getDisplayName()}-----`)
        // // 正式环境这行代码不要注释
        // if (bot.contacts[msg.FromUserName].getDisplayName() != '小冰') {
        //     return;
        // }
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
                    var links = pitchLinkFromContent(msg.Content)
                    if (links != null && links.length != 0) {

                        bot.sendMsg("收到" + links.length + "篇文章,正在转化为录音,请稍后~~", msg.FromUserName)
                        var mp3urls = await audioConvertFromURLs(links)
                        if (mp3urls.length != 0) {
                            sendMsg(bot, msg, mp3urls)
                        } else if (global.mutang.length != 0) {
                            bot.sendMsg("音频转换失败,失败的链接:" + links, global.mutang)
                        }
                    } else if (global.xiaobing.length != 0) {
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
                } else if (msg.AppMsgType == 5) {
                    /**
                     * 转发的文章
                     */
                    try {
                        var result = await xmlparseString(msg.Content)
                        var urls = result.msg.appmsg[0].url
                        bot.sendMsg("收到" + urls.length + "篇文章,正在转化为录音,请稍后~~", msg.FromUserName)
                        var mp3urls = await audioConvertFromURLs(urls)
                        sendMsg(bot, msg, mp3urls)
                    } catch (error) {
                        console.error(error)
                        bot.sendMsg("获取转发的链接失败,")
                        if (global.mutang.length != 0) {
                            bot.sendMsg("音频转换失败,失败的链接:" + links, global.mutang)
                        }
                    }
                }
                break
            default:
                break
        }
    })

}

module.exports = handMsg

function pitchLinkFromContent(content) {
    str = /(http:\/\/|https:\/\/|www)((\S)+)/g
    return content.match(str)
}

const sendMsg = (bot, msg, arr) => {
    for (var key in arr) {
        if (arr.hasOwnProperty(key)) {
            // var dict = arr[key];
            // url = config['host'] + "/audio?url=" + dict['audio'] + "&&title=" + encodeURI(dict['title'])
            url = config['host'] + "/audio?id=" +arr[key]
            bot.sendMsg('音频地址:' + url, msg.FromUserName)
        }
    }
}

// content = "欢迎访问我的个人网站：http://www.zhangxinxu.com/欢迎访问我的个人网站：https://www.zhangxinxu.com/欢迎访问我的个人网站：www.zhangxinxu.com/";
// str = /(http:\/\/|https:\/\/|www)((\w|=|\?|\.|\/|&|-)+)/g

// console.log("jieguo:" + content.match(str))