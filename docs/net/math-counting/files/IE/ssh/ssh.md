# SSH（口令认证）配置与 Python 自动化（Paramiko）

## 1. 服务器侧配置（AAA + Stelnet/SSH）

> 目标：创建本地 AAA 用户，通过 **SSH（Stelnet）口令认证** 登录设备的 VTY。

### 1.1 创建 AAA 本地用户

```text
local-user python password cipher Huawei@123
local-user python privilege level 3
local-user python service-type ssh
```

说明：

- `privilege level` 建议 **3 及以上**（权限不足会导致很多命令不可用）
- `service-type ssh` 指定该用户允许使用 SSH 相关服务（不同型号可能还支持 `stelnet / sftp / snetconf` 等）

---

### 1.2 开启 Stelnet 服务 + 绑定用户与认证方式

```text
stelnet server enable
ssh user python service-type stelnet
ssh user python authentication-type password
```

说明：

- `stelnet server enable`：开启基于 SSH 的远程登录（华为常称 Stelnet）
- `ssh user ...`：将 AAA 用户映射为可用于 stelnet 的 SSH 用户，并指定口令认证

---

### 1.3 VTY 启用 AAA 认证，并仅允许 SSH 接入

```text
user-interface vty 0 4
authentication-mode aaa
protocol inbound ssh
```

说明：

- `authentication-mode aaa`：登录认证走 AAA
- `protocol inbound ssh`：只允许 SSH（避免默认 telnet 接入）

---

## 2. 客户机侧（LSW2 模拟，可选）

### 2.1 首次启用 SSH 客户端功能

```text
ssh client first-time enable
```

### 2.2 发起连接

```text
stelnet X.X.X.X
```

首次连接会提示是否接受/保存服务器公钥，输入 `Y` 确认即可。

---

## 3. Python 自动化（Paramiko）

安装依赖：

```bash
pip install paramiko
```

注意事项：

- 确保网络可达（路由/ACL 放通）
- 确保账号权限足够（AAA 用户等级）
- 确保 VTY 已允许 SSH（`protocol inbound ssh`）
- 首次连接主机密钥提示在 Paramiko 中用 `AutoAddPolicy()` 处理

---

### 3.1 示例 1：登录单台设备并下发命令

```python
import time
import paramiko

username = 'python'
password = 'Huawei@123'

ssh = paramiko.SSHClient()                                   # 调用 SSHClient 类
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())    # 自动接受并保存主机密钥
ssh.connect(hostname='10.1.1.1', username=username, password=password)
print('登录成功')

cli = ssh.invoke_shell()                 # 开启交互式命令行
cli.send('system\n')                     # 进入系统视图
cli.send('vlan batch 1 to 10\n')         # 创建 VLAN 1 到 10

time.sleep(1)                            # 等待设备处理命令（命令越多，时间可加长）

output = cli.recv(999999).decode(errors='ignore')
print(output)

ssh.close()
```

---

### 3.2 示例 2：循环登录多台设备 + 从文件读取命令批量下发

```python
import time
import paramiko

username = 'python'
password = 'Huawei@123'

X = 1
while X <= 2:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname='10.1.1.{}'.format(X), username=username, password=password)
    print(f'10.1.1.{X} 登录成功')

    cli = ssh.invoke_shell()
    cli.send('system\n')
    cli.send('vlan batch 1 to 10\n')
    time.sleep(1)

    # 从文件读取命令逐行下发
    with open(r'E:\cmd.txt', encoding='utf-8') as f:
        for line in f:
            if not line.strip():  # 跳过空行
                continue
            cli.send(line if line.endswith('\n') else line + '\n')
            time.sleep(1)

    output = cli.recv(999999).decode(errors='ignore')
    print(output)

    ssh.close()
    X += 1
else:
    print('执行完成')
```