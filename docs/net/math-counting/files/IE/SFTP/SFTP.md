# FTP / SFTP 基础与配置、Python 自动化备份（Paramiko）

## 1. FTP 与 SFTP 的区别

- **FTP（File Transfer Protocol）**：以**明文**方式传输（用户名、密码、数据都可能被抓包看到），用于上传/下载文件（txt、mp4、cfg、zip 等）。
- **SFTP（SSH File Transfer Protocol）**：基于 **SSH** 的文件传输协议，利用 SSH 对传输过程进行**加密保护**（更安全，推荐）。

---

## 2. SFTP 配置命令

> 目标：创建 AAA 用户，通过 SSH/SFTP 登录设备并访问指定目录（如 `flash:/`）。

### 2.1 服务器侧（设备）配置

#### 1）AAA 创建账户

```text
local-user python password cipher Huawei@123
local-user python privilege level 3
local-user python service-type ssh
```

说明：

- 用户等级建议 **3 及以上**
- `service-type ssh`：允许该用户使用 SSH 相关服务（包含：stelnet / sftp / snetconf 等，具体以设备为准）

---

#### 2）开启服务、指定用户与目录权限（系统视图）

```text
stelnet server enable
sftp server enable
ssh user python service-type all
ssh user python authentication-type password
ssh user python sftp-directory flash:/
```

说明：

- `sftp server enable`：开启 SFTP 服务
- `ssh user python service-type all`：允许该用户使用 stelnet、sftp 等服务
- `ssh user python sftp-directory flash:/`：限制该用户登录后可访问的目录（示例为设备 `flash:/` 根目录）

---

#### 3）VTY 认证模式与接入协议

```text
user-interface vty 0 4
authentication-mode aaa
protocol inbound ssh
```

说明：

- `authentication-mode aaa`：走 AAA 认证
- `protocol inbound ssh`：仅允许 SSH（更安全）

---

### 2.2 客户机侧（命令行方式）

#### 1）首次启用 SSH 客户端功能

```text
ssh client first-time enable
```

#### 2）发起 SFTP 连接（系统视图）

```text
sftp X.X.X.X
```

首次连接会提示是否接受/保存服务器公钥，按提示输入 `Y` 确认；然后输入用户名和密码登录。

#### 3）常用 SFTP 命令（在 sftp 会话中）

```text
ls        // 查看远端目录文件（类似 display this 的效果）
get xxx   // 下载文件（后面跟文件名）
put xxx   // 上传文件（后面跟文件名）
```

---

## 3. 设备侧常用查看/启动相关命令（用户视图）

```text
dir
display startup
startup saved-configuration lsw1.zip
reboot
```

说明：

- `dir`：查看当前目录文件信息
- `display startup`：查看本次/下次启动加载的文件（系统文件、补丁、zip、cfg 等）
- `startup saved-configuration lsw1.zip`：设置下次启动使用某个配置/存储文件（“读档”）
- `reboot`：重启设备（按提示确认）

> 注意：不同 VRP/版本对 zip/cfg 的行为可能有差异，以设备提示为准。

---

## 4. Python 自动化：SFTP 定时备份/拉取文件（Paramiko）

安装依赖：

```bash
pip install paramiko
```

> 说明：此示例使用 `paramiko.Transport` + `SFTPClient`，通过 22 端口建立 SFTP 会话，定时把远端文件下载到本地备份目录。

```python
import time
import paramiko

data = time.strftime('%Y_%m_%d')  # 时间参数（Y=年，m=月，d=日）

username = 'python'
password = 'Huawei@123'

local_path = r'E:\Backup_file\{}_LSW1_backup.zip'.format(data)  # 本地保存路径（运行脚本的机器）
remote_path = r'/{}_LSW1.zip'.format(data)                      # 远端路径（设备 sftp-directory 下的路径）

while True:  # 周期执行（死循环，可按需删除/改为定时任务）
    transport = paramiko.Transport(('10.1.1.1', 22))
    transport.connect(username=username, password=password)
    print('登录成功')

    sftp = paramiko.SFTPClient.from_transport(transport)

    # 下载：get = 从远端到本地；上传用 put
    sftp.get(remotepath=remote_path, localpath=local_path)
    print('OK')

    sftp.close()
    transport.close()

    time.sleep(24 * 3600)  # 休眠 24 小时
```

小建议：

- 如果远端文件名固定（不带日期），可以把 `remote_path` 改成固定名称。
- 建议加异常处理（网络中断/认证失败/文件不存在），避免脚本直接退出。
