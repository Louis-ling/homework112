let datbase = require("./datbase.js");
module.exports = function main(inputs) {
    let i;
    let j;
    let totalSum = 0;
    let totalSave = 0;
    let purchase//所购物品
    let items//商品信息
    let discountedgoods//打折信息
        purchase = count(inputs);
        items = datbase.loadAllItems();
        discountedgoods = datbase.loadPromotions();
    let expectText="";
    //以下为打印格式
    expectText+="***<没钱赚商店>购物清单***\n";
    for(i=0;i<purchase.length;i++)
    {
        let save = countSave(purchase[i].barcode,discountedgoods,purchase[i].count);
        for(j=0;j<items.length;j++)
        {
            if(items[j].barcode===purchase[i].barcode)
            {
                totalSave += save*items[j].price;
                let sum = items[j].price*purchase[i].count - save*items[j].price;
                s=parseFloat(sum).toFixed(2)//按格式要求保留两位
                totalSum+=sum;
                p=parseFloat(items[j].price).toFixed(2)//同上
                expectText+="名称："+items[j].name+"，数量："+purchase[i].count+items[j].unit+"，单价："+p+"(元)"+"，小计："+s+"(元)\n";
            }
        }
    }
    expectText+="----------------------\n";
    expectText+="挥泪赠送商品：\n";
    for(i=0;i<purchase.length;i++)
    {
        let save = countSave(purchase[i].barcode,discountedgoods,purchase[i].count);
        if(save!==0)
        {
            for(j=0;j<items.length;j++)
            {
                if(items[j].barcode===purchase[i].barcode)
                {
                    expectText+="名称："+items[j].name+"，数量："+save+items[j].unit+"\n";
                }
            }
        }
    }
    expectText+="----------------------\n";
    TSU=parseFloat(totalSum).toFixed(2)
    TSA=parseFloat(totalSave).toFixed(2)
    expectText+="总计："+TSU+"(元)\n";
    expectText+="节省："+TSA+"(元)\n";
    expectText+="**********************";
    console.log(expectText);
};

//分类统计数量
function count(inputs) {
    let information=[];
    let m;
    let barcoding;
    for(let l = 0;l<inputs.length;l++)
    {
        let k = inputs[l];//编码格式为ITEM000000*-# *用于区分商品，#表示数量
        barcoding = k.substring(0,10);//前十位，即条形编码对应的商品
        m = k.substring(11);//m表示编码超过十位的商品的数量
        //分类计数
        let tag = -1;
        for(let w = 0;w< information.length;w++)
        {
            let b = information[w];
            if(b.barcode===barcoding)
                tag = w;
        }
        if(tag===-1)
        {
            let tem = {};
            tem.barcode = barcoding;

            if(k.length>10)
                tem.count = m;
            else
                tem.count = 1;
            information.push(tem);
        }
        else
        {
            if(k.length>10)
                information[tag].count+=m;
            else
                information[tag].count+=1;
        }

    }
    return information;
}

//统计折扣商品数量
function countSave(barcode,discountedgoods,number)
{
    let i;
    let j;
    for(i=0;i<discountedgoods.length;i++)
    {
        let b = discountedgoods[i].barcodes;
        for(j=0;j<b.length;j++) {
            if (b[j] === barcode) {
                if (discountedgoods[i].type === "BUY_TWO_GET_ONE_FREE")
                {
                    return Math.floor(number / 3);//向下取整函数
                }
            }
        }
    }
    return 0;//非折扣商品返回0
}
