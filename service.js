// 业务模块

const data = require('./data.json')
const path = require('path')
const fs = require('fs')

// 自动生成图书编号（自增）
let maxBookCode = () => {
    let arr = []
    data.forEach((item)=>{
        arr.push(item.id)
    })
    return Math.max.apply(null,arr)
}
// 把内存数据写入文件
let writeDataToFile = (res) => {
    fs.writeFile(path.join(__dirname,'data.json'),JSON.stringify(data,null,4),(err)=>{
        if(err) throw err;
        // 文件写入成功之后重新跳转到主页面
        res.redirect('/');   
    })
}


// 渲染主页面
exports.showIndex = (req,res) => {
    res.render('index',{list:data})
}

// 跳转到添加图书的页面
exports.toAddBook = (req,res) => {
    res.render('addBook',{})
}

// 添加图书保存数据
exports.addBook = (req,res) => {
    // 获取表单数据
    let param = req.body;
    let book = {};
    for(let key in param){
        book[key] = param[key]
    }
    book.id = maxBookCode() + 1;
    data.push(book);
    // 把内存中的数据写入文件
   writeDataToFile(res);
}

// 跳转到编辑页面
exports.toEditBook = (req,res) => {
    let id = req.query.id;
    let book = {}
    data.forEach((item)=>{
        if(id == item.id){
            book = item;
            return
        }
    })
    res.render('editBook',book)
}

// 编辑图书更新数据
exports.editBook = (req,res) => {
    let param = req.body;
    data.forEach((item)=>{
        if(param.id == item.id){
            for(let key in param){
                item[key] = param[key]
            }
            return
        }
    })
    writeDataToFile(res);
}

exports.delBook = (req,res) => {
    let id = req.query.id;
    data.forEach((item,index)=>{
        if(id == item.id){
            // 删除数组的一项数据
            data.splice(index,1)
        }
        return
    })
    writeDataToFile(res);
}