# runjs
A tool run javascript by Java 8.


有时候需要动态运行代码，比如做一些简单的自动化测试，处理一些文件，爬取网站，导入一些数据等等；想法是利用JVM内置的脚本引擎（nashorn）执行js脚本。

js的使用门槛相对较低，可以让测试人员和其他非技术人员参与编写测试用例脚本或者修改参数运行定期任务等等。

## 介绍

```
    /rj                      工具主目录
    ├───/bin                    执行目录
    │   └───/runjs.sh           执行脚本(linux下)
    │   └───/runjs.bat          执行脚本(win下)
    ├───/lib                    依赖库目录（jar）
    └───/ext                    扩展库目录（jar）
```

## 安装


1. 安装JDK1.8
2. 解压缩runjs_{version}.zip

## 运行

执行目标脚本(下示例为xxx.js)

- win: 运行> ```rj/bin/runjs.bat xxx.js```
- linux: 运行> ```sh rj/bin/runjs.sh xxx.js```


## 内置方法

### $.uuid()

生成一个全局唯一的编号

### $.str(s)

把传入的对象转化为字符串返回

### $.date2str(d, pattern)

把目标时间转换为格式化的时间字符串

参数名| 类型 | 必选 |	说明
---  | --- | --- | ---
d 	| Number/Date/java.util.Date |	是 |	时间值
pattern | String | 否 |	时间字符串的模板，默认为yyyy-MM-dd HH:mm:ss

### $.str2date(s, pattern)

把字符串转换为Date

参数名| 类型 | 必选 |	说明
---  | --- | --- | ---
s |	String | 是 | 时间字符串
pattern | String | 否 |	时间字符串的模板，默认为yyyy-MM-dd HH:mm:ss

### $.log(msg)

记录日志，输出到日志记录器，INFO级别的日志 

参数名| 类型 | 必选 |	说明
---  | --- | --- | ---
msg | String | 是 |	要输出日志的信息


### $.fs.ls(path)

列出路径下的所有文件的全路径，返回一个字符串数组
    
### $.fs.mkdirs(path)

创建目录，返回是否成功，boolean

### $.fs.cat(path, charset)

读取文本文件，转化为一个字符串返回

参数名| 类型 | 必选 |	说明
---  | --- | --- | ---
path | String | 是 | 要读取的文件路径
charset | String | 否 | 文件的编码，默认是UTF-8

### $.fs.isDir(path)

判断路径是否是目录，返回boolean

### $.fs.isFile(path)

判断路径是否是文件，返回boolean

### $.fs.outPrint(path)

打开一个字符输出流，使用UTF-8编码，实际返回了java.io.PrintStream对象，后续主要使用 其print和println输出字符串；
注意，在使用完毕后，调用close关闭输出流；

```
var out = fs.outPrint('/xxx/xx.log');
out.println('hello world');
out.close();
```

### $.fs.eachLine(path, fn)
读取一个文件，并注册一个回调函数，回调中处理每一行的文本；
注意，这个回调的返回false时，文件读取将结束，否则文件读取完毕结束。

```
fs.eachLine('/xxx/xx.log', function(line){
    print(line);
});
```

