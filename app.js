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
    token: 'your token',
    appid: 'your appid',
    encodingAESKey: 'your keys'
  };
  

var KQNumber = 1234;
const rootName = 'your wechat id';

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
