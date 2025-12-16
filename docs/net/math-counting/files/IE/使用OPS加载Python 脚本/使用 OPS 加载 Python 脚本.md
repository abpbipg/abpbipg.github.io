```
使用 WEB 服务器与 CE 交换机互联
WEB 服务器与 CE 交换机相同网段即可（如：192.168.56.X/24）
```

### 1、打开 pycharm 创建一个 python 文件
```
    代码获取方式（CE 12800 → 配置 → 设备管理配置指南 → OPS 配置 → OPS脚本制作及示例模板）
```
```
（把以下代码复制到 pycharm 中）	

——————————————————————————————————————————————————
#!/usr/bin/env python
# -*- coding: utf-8 -*- 

import traceback
import httplib
import string

# 定义调用RESTful API的类，该类中定义了一些方法来执行建立HTTP连接时的操作。该部分无需修改，用户可以直接使用。
# 该部分可以直接调用，用户不需要修改。
class OPSConnection(object):
    """Make an OPS connection instance."""

    # 初始化类，创建一个HTTP连接。
    def __init__(self, host, port = 80):
        self.host = host
        self.port = port
        self.headers = {
            "Content-type": "text/xml",
            "Accept":       "text/xml"
            }
        self.conn = None

    # 关闭HTTP连接。
    def close(self):
        """Close the connection"""
        self.conn.close()

    # 创建设备资源操作。
    def create(self, uri, req_data):
        """Create operation"""
        ret = self.rest_call("POST", uri, req_data)
        return ret

    # 删除设备资源操作。
    def delete(self, uri, req_data):
        """Delete operation"""
        ret = self.rest_call("DELETE", uri, req_data)
        return ret

    # 查询设备资源操作。
    def get(self, uri, req_data = None):
        """Get operation"""
        ret = self.rest_call("GET", uri, req_data)
        return ret

    # 修改设备资源操作。
    def set(self, uri, req_data):
        """Set operation"""
        ret = self.rest_call("PUT", uri, req_data)
        return ret

    # 类内部调用的方法。
    def rest_call(self, method, uri, req_data):
        """REST call"""
        print('|---------------------------------- request: ----------------------------------|')
        print('%s %s HTTP/1.1\n' % (method, uri))
        if req_data == None:
            body = ""
        else:
            body = req_data
            print(body)
        if self.conn:
            self.conn.close()
        self.conn = httplib.HTTPConnection(self.host, self.port)

        self.conn.request(method, uri, body, self.headers)
        response = self.conn.getresponse()
        response.status = httplib.OK    # stub code
        ret = (response.status, response.reason, response.read())
        print('|---------------------------------- response: ---------------------------------|')
        print('HTTP/1.1 %s %s\n\n%s' % ret)
        print('|------------------------------------------------------------------------------|')
        return ret

# 定义获取系统启动信息的函数。
def get_startup_info(ops_conn):

    # 指定系统启动信息的URI。URI为Resetful API中定义的管理对象，不同的管理对象有不同的URI。
    # 用户需要根据实际需求对URI进行修改，关于设备支持的URI可参考RESTful API。
    uri = "/cfg/startupInfos/startupInfo"

    # 指定发送的请求内容。该部分内容与URI相对应，不同的URI对应不同的请求内容。
    # 用户需要根据实际使用的URI对请求内容进行修改，关于请求内容的格式可参考RESTful API。
    req_data = \
'''<?xml version="1.0" encoding="UTF-8"?>
<startupInfo>
</startupInfo>
'''
    
    # 执行一个GET操作请求。uri和req_data为请求URI和请求内容。ret为请求是否成功的标识，rsp_data为请求执行后系统的响应数据，关于响应数据的格式可参考RESTful API。
    
    # 此处系统启动信息的响应数据类似于下面所示。用户可以通过解析响应数据来获取系统启动信息。
    '''
    <?xml version="1.0" encoding="UTF-8"?>
    <rpc-reply>
      <data>
        <cfg xmlns="http://www.huawei.com/netconf/vrp" format-version="1.0" content-version="1.0">
          <startupInfos>
            <startupInfo>
              <position>6</position>
              <nextStartupFile>flash:/vrpcfg.cfg</nextStartupFile>
              <configedSysSoft>flash:/system-software.cc</configedSysSoft>
              <curSysSoft>flash:/system-software.cc</curSysSoft>
              <nextSysSoft>flash:/system-software.cc</nextSysSoft>
              <curStartupFile>flash:/vrpcfg.cfg</curStartupFile>
              <curPatchFile>NULL</curPatchFile>
              <nextPatchFile>NULL</nextPatchFile>
            </startupInfo>
          </startupInfos>
        </cfg>
      </data>
    </rpc-reply>
    '''
    # 用户可以根据实际需求对请求类型get()进行修改，例如修改为set()或者create()。
    ret, _, rsp_data = ops_conn.get(uri, req_data)
    if ret != httplib.OK:
        return None

    return rsp_data

    # main()函数定义脚本运行时需要执行的操作，用户可根据实际需求进行修改。
def main():
    """The main function."""

    # host表示环路地址，目前RESTful API仅支持设备内部调用，即取值为“localhost”。
    host = "localhost"
    try:
        # 建立HTTP连接。
        ops_conn = OPSConnection(host)
        # 调用获取系统启动信息的函数。
        rsp_data = get_startup_info(ops_conn)
        # 关闭HTTP连接。
        ops_conn.close()
        return

    except:
        errinfo = traceback.format_exc()
        print(errinfo)
        return

if __name__ == "__main__":
    main()

———————————————————————————————————————————————————
```

### 2、把该 python 文件放在任意磁盘路径中（最好是磁盘中，不要放在文件路径中，如：E:/）
```
    开启 WEB 服务器的 FTP 服务（启动 python 文件路径）
```
### 3、CE 设备通过 FTP 登录到 WEB 服务器获取文件
```
	① 用户视图
		ftp 192.168.56.1（ftp 服务器地址）

	② 输入任意账号密码（任意均可）

	③ 通过 get 命令下载文件到 CE 上
		使用 dir 查看是否获取相关文件
```
### 4、使用 OPS 安装 python 文件
```
	① 用户视图
		ops install file  +  文件名称

	② 查看是否安装成功
	 	display ops script （如出现相关文件代表安装成功）

	③ 运行该文件
		ops run python  +  文件名称


	补充—————————————————————————————————————
	
	④ 删除文件
		ops uninstall file  +  文件名称

	⑤ 停止服务
		ops stop  +  文件名称

```
	










