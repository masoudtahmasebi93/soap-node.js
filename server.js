
var querystring = require('querystring');
var control = require('strong-cluster-control');
var loopback = require('loopback');
var boot = require('loopback-boot');
var http = require('http');
var bodyParser = require('body-parser');
var soap = require('strong-soap').soap;
var express = require('express');
var request = require('request');
var terminalIdNum = '0';
var userPasswordNum = '0';
var userNameString ='';

var app = module.exports = loopback();
app.set('view engine', 'express');
require('loopback-counts-mixin')(app);

app.post('/bpm', function(req, res) {
        var model = app.models.userCredit;
        console.log(req.body);
        model.find({ where: { id: req.body.id }, limit: 3 }, function(err, order) {
                console.log(order[0]);
                var url = 'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl';
                var requestArgs = { terminalId: terminalIdNum, amount: req.body.amount, userPassword: userPasswordNum, payerId: 0, userName: userNameString, localTime: req.body.localTime, localDate: req.body.localDate, additionalData: req.body.userId, orderId: order[0].order, callBackUrl: "http://www.url.com/bpmEnd" };
                console.log(requestArgs);
                var options = {};
                soap.createClient(url, options, function(err, client) {
                    var method = client['bpPayRequest'];
                    method(requestArgs, function(err, result, envelope, soapHeader) {
                        //response envelope
                        console.log('Response Envelope: \n' + envelope);
                        //'result' is the response body
                        console.log('Result: \n' + result);
                        // if (result['return'] == 421) {
                        if (result.return != undefined) {
                            console.log(result.return.substring(2));
                            var content = { RefId: result.return.substring(2) };
                            res.send(content);
                        } else
                            res.send(result);
                    });

                });

            })
            // });

    });

    app.post('/bpmEnd', function(req, res) {

        console.log(req);

        switch (parseInt(req.body.ResCode)) {
            case 0:
               
                //model update
                //go to view 
                resultEnd = 'ﺗﺮاﻛﻨﺶ_ﺑﺎ_ﻣﻮﻓﻘﻴﺖ_اﻧﺠﺎم_ﺷﺪ';
                break;
                //redirect
            case 11:
                resultEnd = 'ﺷﻤﺎره_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 12:
                resultEnd = 'ﻣﻮﺟﻮدي_ﻛﺎﻓﻲ_ﻧﻴﺴﺖ';
                break;
            case 13:
                resultEnd = 'رﻣﺰ_ﻧﺎدرﺳﺖ_اﺳﺖ';
                break;
            case 14:
                resultEnd = 'ﺗﻌﺪاد_دﻓﻌﺎت_وارد_ﻛﺮدن_رﻣﺰ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ';
                break;
            case 15:
                resultEnd = 'ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 16:
                resultEnd = 'دﻓﻌﺎت_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ';
                break;
            case 17:
                resultEnd = 'ﻛﺎرﺑﺮ_از_اﻧﺠﺎم_ﺗﺮاﻛﻨﺶ_ﻣﻨﺼﺮف_ﺷﺪه_اﺳﺖ';
                break;
            case 18:
                resultEnd = 'ﺗﺎرﻳﺦ_اﻧﻘﻀﺎي_ﻛﺎرت_ﮔﺬﺷﺘﻪ_اﺳﺖ';
                break;
            case 19:
                resultEnd = 'ﻣﺒﻠﻎ_ﺑﺮداﺷﺖ_وﺟﻪ_ﺑﻴﺶ_از_ﺣﺪ_ﻣﺠﺎز_اﺳﺖ';
                break;
            case 111:
                resultEnd = 'ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 112:
                resultEnd = 'ﺧﻄﺎي_ﺳﻮﻳﻴﭻ_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت';
                break;
            case 113:
                resultEnd = 'ﭘﺎﺳﺨﻲ_از_ﺻﺎدر_ﻛﻨﻨﺪه_ﻛﺎرت_درﻳﺎﻓﺖ_ﻧﺸﺪ';
                break;
            case 114:
                resultEnd = 'دارﻧﺪه_ﻛﺎرت_ﻣﺠﺎز_ﺑﻪ_اﻧﺠﺎم_اﻳﻦ_ﺗﺮاﻛﻨﺶ_ﻧﻴﺴﺖ';
                break;
            case 21:
                resultEnd = 'ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 23:
                resultEnd = 'ﺧﻄﺎي_اﻣﻨﻴﺘﻲ_رخ_داده_اﺳﺖ';
                break;
            case 24:
                resultEnd = 'اﻃﻼﻋﺎت_ﻛﺎرﺑﺮي_ﭘﺬﻳﺮﻧﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 25:
                resultEnd = 'ﻣﺒﻠﻎ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 31:
                resultEnd = 'ﭘﺎﺳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 32:
                resultEnd = 'ﻓﺮﻣﺖ_اﻃﻼﻋﺎت_وارد_ﺷﺪه_ﺻﺤﻴﺢ_ﻧﻤﻲ_ﺑﺎﺷﺪ';
                break;
            case 33:
                resultEnd = 'ﺣﺴﺎب_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 34:
                resultEnd = 'ﺧﻄﺎي_ﺳﻴﺴﺘﻤﻲ';
                break;
            case 35:
                resultEnd = 'ﺗﺎرﻳﺦ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 41:
                resultEnd = 'ﺷﻤﺎره_درﺧﻮاﺳﺖ_ﺗﻜﺮاري_اﺳﺖ';
                break;
            case 42:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_Sale_یافت_نشد_';
                break;
            case 43:
                resultEnd = 'ﻗﺒﻼ_Verify_درﺧﻮاﺳﺖ_داده_ﺷﺪه_اﺳﺖ';
                break;
            case 44:
                resultEnd = 'درخواست_verify_یافت_نشد';
                break;
            case 45:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_Settle_ﺷﺪه_اﺳﺖ';
                break;
            case 46:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_Settle_نشده_اﺳﺖ';
                break;
            case 47:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_Settle_یافت_نشد';
                break;
            case 48:
                resultEnd = 'تراکنش_Reverse_شده_است';
                break;
            case 49:
                resultEnd = 'تراکنش_Refund_یافت_نشد';
                break;
            case 412:
                resultEnd = 'شناسه_قبض_نادرست_است';
                break;
            case 413:
                resultEnd = 'ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻧﺎدرﺳﺖ_اﺳﺖ';
                break;
            case 414:
                resultEnd = 'سازﻣﺎن_ﺻﺎدر_ﻛﻨﻨﺪه_ﻗﺒﺾ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 415:
                resultEnd = 'زﻣﺎن_ﺟﻠﺴﻪ_ﻛﺎري_ﺑﻪ_ﭘﺎﻳﺎن_رسیده_است';
                break;
            case 416:
                resultEnd = 'ﺧﻄﺎ_در_ﺛﺒﺖ_اﻃﻼﻋﺎت';
                break;
            case 417:
                resultEnd = 'ﺷﻨﺎﺳﻪ_ﭘﺮداﺧﺖ_ﻛﻨﻨﺪه_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 418:
                resultEnd = 'اﺷﻜﺎل_در_ﺗﻌﺮﻳﻒ_اﻃﻼﻋﺎت_ﻣﺸﺘﺮي';
                break;
            case 419:
                resultEnd = 'ﺗﻌﺪاد_دﻓﻌﺎت_ورود_اﻃﻼﻋﺎت_از_ﺣﺪ_ﻣﺠﺎز_ﮔﺬﺷﺘﻪ_اﺳﺖ';
                break;
            case 421:
                resultEnd = 'IP_نامعتبر_است';
                break;
            case 51:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_ﺗﻜﺮاري_اﺳﺖ';
                break;
            case 54:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_ﻣﺮﺟﻊ_ﻣﻮﺟﻮد_ﻧﻴﺴﺖ';
                break;
            case 55:
                resultEnd = 'ﺗﺮاﻛﻨﺶ_ﻧﺎﻣﻌﺘﺒﺮ_اﺳﺖ';
                break;
            case 61:
                resultEnd = 'ﺧﻄﺎ_در_واریز';
                break;
        }
        res.render('bpmEnd.ejs', { user: req.body.RefId, title: resultEnd, orderId: req.body.SaleOrderId });
    });

