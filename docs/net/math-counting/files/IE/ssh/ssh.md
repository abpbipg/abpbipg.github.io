SSH 配置命令（口令认证）
服务器配置
	1、进入 AAA 创建账户
		local-user python password cipher Huawei@123			// 创建账户信息（用户名：python，密码：Huawei@123）
 		local-user python privilege level 3						// 用户等级必须 3 及以上
 		local-user python service-type ssh					// 指定服务类型为 ssh（包含：stelnet、sftp、snetconf）

	2、系统配置视图，开启服务及指定用户
		stelnet server enable 								// 开启 Stelnet 服务
		ssh user python service-type stelnet					// 指定 python 用户，用于 stelnet 服务
		ssh user python authentication-type password			// 指定认证类型为：password（口令认证）

	3、指定 AAA 用户登录，且接入协议为 SSH
		user-interface vty 0 4								// 进入 VTY 0 4 信道组合
 		authentication-mode aaa							// 指定认证模式为 AAA
 		protocol inbound ssh								// 指定接入的协议为 SSH（默认为：telnet）

	（确保网络可达后，可以使用工具接入）

客户机（LSW2 模拟）
	1、全局配置
		ssh client first-time enable

	2、接入设备
	（系统配置视图）
		stelnet X.X.X.X										// X.X.X.X 为交换机 1 的 IP 地址
	
	补充：提示信息，需要敲 Y（确认接入服务器，和保存服务器发送的公钥）





Python 代码：
import time
import paramiko

username = 'python'
password = 'Huawei@123'


ssh = paramiko.SSHClient()                                                              						# 调用 SSHClient 类
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())                               			# 自动添加密钥
ssh.connect(hostname='10.1.1.1', username=username, password=password)       			# 登录设备
print('登录成功')


cli = ssh.invoke_shell()                                           			# 开启交互式命令行
cli.send('system\n')                                               			# 输入进入系统
cli.send('vlan batch 1 to 10\n')                               		# 创建 VLAN 1 到 10
time.sleep(1)                                                      			# 设备读取命令的时间（为 1s）命令越多，时间越长


dis = cli.recv(999999).decode()                                    		# 打印命令行中信息
print(dis)




代码 2：
import time
import paramiko

username = 'python'
password = 'Huawei@123'

X = 1                                                                                       # 初始数值 = 1
while X <=2:                                                                                # 判断 X <=2，如果为真，则执行以下代码
    ssh = paramiko.SSHClient()                                                              # 调用 SSHClient 类
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())                               # 自动添加密钥
    ssh.connect(hostname='10.1.1.{}'.format(X), username=username, password=password)       # 登录设备
    print('登录成功')

    cli = ssh.invoke_shell()                                           # 开启交互式命令行
    cli.send('system\n')                                               # 输入进入系统
    cli.send('vlan batch 1 to 10\n')                                   # 创建 VLAN 1 到 10
    time.sleep(1)                                                      # 设备读取命令的时间（为 1s）命令越多，时间越长

    B = open(r'E:\cmd.txt')                                            # 非固代码的命令（打开代码文件）
    for aa in B:                                                       # aa 属于 open 打开的 cmd 中
        cli.send(aa)                                                   # 如果是输入到交互式命令行中，配置出来
        time.sleep(1)

    dis = cli.recv(999999).decode()                                    # 打印命令行中信息
    print(dis)

    X = X + 1                                                          # X + 1 代表重新进入循环，但 X 从 2 开始（进入 LSW2）
else:
    print('执行完成')                                                   # 当 X > 2 跳出循环