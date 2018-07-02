import Koa from 'koa';
import Router from "koa-router";
import path from 'path';
import koaBetterBody from 'koa-better-body';
import moment from 'moment';
import wechat from 'co-wechat';



import { User, Sign, Student } from './model.js';

const app = new Koa();
const router = new Router();

app.use(koaBetterBody());
//app.use(cors());

app.use(require('koa-static')(path.join(__dirname, '../build')));


var errorHandle = (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                error: err.originalError ? err.originalError.message : err.message,
            };
        } else {
            throw err;
        }
    });
}


app.use(errorHandle);



app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});



//router.use('/pro_Servers', ProRouter.routes(), ProRouter.allowedMethods());  //用户相关的路由

app.use(router.routes());
app.use(router.allowedMethods());




const config = {
    token: 'wins',
    appid: 'wx35f7bd5556b7ba99',
    encodingAESKey: 'BxMZxSPHBBcdTBuA97POLus0wJnVqkWog8kJmz3Bu0k'
  };
  

var KQNumber = 1234;
const rootName = 'ongBTuM66Gt7rAR5Gjzu9oi5sSH4';

var kqstart = false;

app.use(wechat(config).middleware(async (message, ctx) => {

    const { Content, FromUserName } = message;

    console.log(Content);
    const ex_bind = /BDXH[0-9]+/;
    const ex_sign = /KQ[0-9]+/;

    if(ex_bind.test(Content)) {
        var id = Number(Content.slice(4,Content.length));
        var ret = await Student.find({id: id});
        var user = {
            id: id,
            wechatid: FromUserName,
            name: ret[0].name
        };
        var ret = await new User(user).save();
        console.log(ret);
        if(ret.id == id) {
            return '绑定成功';
        } else {
            return '绑定失败';
        }
    } else if(ex_sign.test(Content)) {
        var num = Number(Content.slice(2,Content.length));
        console.log(num);
        if(KQNumber === num && kqstart == true) {
            var ret = await User.find({wechatid: FromUserName});
            var nowtime = new moment(nowtime).format('YYYY-MM-DD HH:mm');
            if(ret.length > 0) {
                var sign = {
                    id: ret[0].id,
                    name: ret[0].name,
                    time: nowtime,
                };
                var ret = await Sign.find({name: ret[0].name});
                if(ret.length > 0) {
                    return '您已经签过了';
                } else { 
                    var ret = await new Sign(sign).save();
                        return '签到成功';
                }
            } else {
                return '签到失败，您还没有进行绑定';
            }
            
        } else {
            return '签到失败'
        }

    } else if(FromUserName === rootName) {
        if(Content === '生成考勤') {
            KQNumber = Math.floor(Math.random()*100000)+1;
            kqstart = true;
            showTime(60);  //1 min
            return String(KQNumber);  //返回签到码
        } else if(Content === '查看考勤') {
           var result = await Sign.find();
        //   console.log(result);
            var info = '';
            result.forEach((value, index) => {
               console.log(value);
               const {id, name} = value;
               const message = id + ' ' + name + '\n';
               info  += message;
           });
           return info;
        }
    }
}));

function showTime(count) {
    if (count == 0) {
        // do job
        kqstart = false;
    } else {
        count -= 1;
        setTimeout(function () {
            showTime(count);
        }, 1000);
    }

}


router.get('/', async (ctx, next) => {
    ctx.body = "hello awildostrich!";
});


const students = [
    [1516040401,'罗建'],
    [1516040402,'凌钰'],
    [1516040403	,'梁泽祥'],
    [1516040405,	'全悦华'],
    [1516040406,	'潘婉媚'],
    [1516040408,	'吴金莲'],
    [1516040409,	'何业源'],
    [1516040410,	'刘振思'],
    [1516040411,	'陈日兰'],
    [1516040412,	'李桂芳'],
    [1516040413,	'潘婷妹'],
    [1516040414,	'陈红'],
    [1516040415,	'韦裕鹏'],
    [1516040416,	'潘美兰'],
    [1516040418,	'廖雪兰'],
    [1516040419,	'钟秋兰'],
    [1516040420,	'曾邓强'],
    [1516040421,	'李袁'],
    [1516040422,	'欧阳秦晋'],
    [1516040423,	'张梓鹏'],
    [1516040424,	'宋子龙'],
    [1516040425,	'覃林柳'],
    [1516040426,	'颜如玉'],
    [1516040427,	'陈欢'],
    [1516040428,	'覃萍萍'],
    [1516040429,	'韦铭'],
    [1516040430,	'陈庆锋'],
    [1516040431,	'黎金炎'],
    [1516040432,	'甘文雅'],
    [1516040433,	'李夏'],
    [1516040434,	'覃志板'],
    [1516040435,	'周李梅'],
    [1516040436,	'秦静云'],
    [1516040437,	'潘成状'],
    [1516040438,	'邓玉仙'],
    [1516040439,	'练春华'],
    [1516040440,	'许兰琴'],
    [1516040441,	'陈俊舟'],
    [1516040442,	'李锦斌'],
    [1516040443,	'严灵灵'],
    [1516040444,	'石丽燕'],
    [1516040445,	'黎恒运'],
    [1516040446,	'周烨'],
    [1516040447,	'黎永强'],
    [1516040448,	'黄燕凤'],
    [1516040449,	'吕冬红'],
    [1516040450,	'黄献慧'],
    [1516040451,	'徐焕娇'],
    [1516040452,	'吴泰棉'],
    [1516040454,	'林郑佳'],
    [1516040455,	'李佳龙'],
    [1516040456,	'何松伦'],
    [1516040457,	'赵梓辉'],
    [1516040458,	'李玉成'],
    [1516040459,	'秦凯']
];
/*
( async () => {
    for(let i=0;i < students.length; i++) {

        const sv = {
            id: students[i][0],
            name: students[i][1]
        };
        await new Student(sv).save();
    };
    
})();
*/



app.listen(80);

module.exports = app;
