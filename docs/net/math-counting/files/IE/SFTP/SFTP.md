FTP（文件传输协议）
	是通过明文方式来传输和下载文件（text、MP4、cfg、zip 等）

SFTP 利用了 SSH 对 FTP 进行保护，在传输过程中可以进行加密


SFTP 配置命令
服务器：
	1、进入 AAA 创建账户
		local-user python password cipher Huawei@123			// 创建账户信息（用户名：python，密码：Huawei@123）
 		local-user python privilege level 3						// 用户等级必须 3 及以上
 		local-user python service-type ssh					// 指定服务类型为 ssh（包含：stelnet、sftp、snetconf）

	2、系统配置视图，开启服务及指定用户
		stelnet server enable 								// 开启 Stelnet 服务
		sftp server enable									// 开启 SFTP 服务
		ssh user python service-type all						// 指定 python 用户，用于 stelnet、sftp 服务
		ssh user python authentication-type password			// 指定认证类型为：password（口令认证）
		ssh user python sftp-directory flash:/					// 指定 python 用户可以访问设备的 flash 中的 / 目录

	3、指定 AAA 用户登录，且接入协议为 SSH
		user-interface vty 0 4								// 进入 VTY 0 4 信道组合
 		authentication-mode aaa							// 指定认证模式为 AAA
 		protocol inbound ssh								// 指定接入的协议为 SSH（默认为：telnet）

客户机：
	1、全局开启 SSH 登录配置
		ssh  client first-time enable							// 设置客户机第一次登录

	2、系统配置视图
		sftp X.X.X.X										// X.X.X.X 是 LSW1 设备的 IP 地址

	3、提示接入和密钥保存，都敲 Y
		输入用户名和密码可以登录设备
		ls												// 查看登录到服务器的文件信息（相当于 display this）
		get												// 下周文件，后面要添加文件名称
		put												// 上传文件

	4、用户视图
		dir												// 查看当前的 / 目录文件信息

		display startup									// 可以查看设备本次启动的（.cc 系统文件，.pat 补丁文件，.zip、.cfg 存储文件等）

		startup saved-configuration  lsw1.zip					// 设置设备下一次启动时，使用 lsw1.zip 的存储文件（读档）

		reboot											// 重启设备（根据提示，Y 代表接收下次重启文件加载 lsw1.zip，Y 代表重启）

	



python 代码：

import time
import paramiko

data = time.strftime('%Y_%m_%d')                            				# 设置时间参数（Y=年，m=月，d=日）
username = 'python'
password = 'Huawei@123'
local_path = r'E:\Backup_file\{}_LSW1_backup.zip'.format(data)     	# 本地路径（一般是执行 python 代码的设备）
remote_path = r'/{}_LSW1.zip'.format(data)                          			# 远端路径（本设备连接的交换机，或路由器等设备）

while True:                                                         					# 用于周期性执行以下参数（死循环）可选，可以删除
    A = paramiko.Transport(('10.1.1.1', 22))                        			# 登录设备
    A.connect(username=username, password=password)                 	# 敲用户名和密码
    print('登录成功')

    sftp = paramiko.SFTPClient.from_transport(A)                    		# 调用 SSH 连接
    sftp.get(localpath=local_path, remotepath=remote_path)          	# get 代表下载，put 代表上传
    print('OK')

    time.sleep(24 * 3600)                                           				# 休眠 24 小时，重新进入循环






	
	
