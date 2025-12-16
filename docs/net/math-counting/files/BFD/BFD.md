# BFD
```
作用：
    可以为网络提供与底层协议无关、传输介质无关，通用的、标准化的传输检测机制
```

## 传统检测方式的缺陷
```
1. 动态协议（如：OSPF、IS-IS、BGP、LDP 等）
	通过 hello 或 keepalive 方式检测邻居状态
    （一般为秒级，无法满足电信级的业务检测需求）

2. 静态协议（如：Static）
	如：静态路由，需要根据下一跳的可达性来判断路由是否有效
    （下一跳可达，路由有效）
```


## 动态协议联动配置（动态模式下，本地和对端标识符都无需手工指定，协议自动进行协商）（OSPF、IS-IS、BGP 等）
### OSPF
```
1、开启 BFD 的功能
	bfd				// 系统配置视图

2、进入协议进程
	ospf 1
	bfd all-interfaces enable	// 针对所有发布在 OSPF 的接口，都开启 BFD 功能（自动进行协商）

	bfd all-interfaces min-tx-interval 100 min-rx-interval 100 detect-multiplier 3 （可选配置）
	
    设置本地 BFD 的最大传输间隔为 100ms 接收间隔为 100ms 倍数（3）
	
    用于控制 BFD 检测速率的配置（一般需要根据链路的传输时延来设置）
	
    例如：客户希望 OSPF 协议能够在 1s 内发现链路故障并进行切换，可以把传输时延设置为 10-300ms（根据链路传输的时延判断，一般 3-5 倍传输时延）

	interface G0/0/X
	ospf bfd enable			
    // 针对某个 OSPF 接口开启 BFD 功能（自动进行协商）
	（双方接口均需要开启） 
```

### IS-IS 配置
```
1、开启 BFD 的功能
	bfd				// 系统配置视图

2、进入协议进程
	isis 1
	bfd all-interfaces enable	// 针对所有发布在 IS-IS 的接口，都开启 BFD 功能（自动进行协商）

	interface G0/0/X
	isis bfd enable			// 针对某个 IS-IS 接口开启 BFD 功能（自动进行协商）
	（双方接口均需要开启） 
```
### BGP 配置
```
1、开启 BFD 的功能
	bfd				// 系统配置视图

2、进入协议进程
	bgp 100
	peer X.X.X.X bfd enable		// 必须在建立了 BGP 对等体的前提下，添加 BFD enable

——————————————————————————————————————————————————————
手工建立（静态配置）
需要手工指定 BFD 对端信息（如：标识符、IP 地址等）

1、开启 BFD 功能
	bfd				// 系统配置视图，开启 BFD 功能
	
2、静态配置 BFD 会话信息
	bfd a bind peer-ip X.X.X.X source-ip Y.Y.Y.Y auto	
    // 创建 BFD 会话（a）邻居地址为：X.X.X.X
		
        本地设备源 IP 地址为：Y.Y.Y.Y  （前提 X 和 Y 能够互访）自动协商标识符

3、对端设备也需要开启 BFD 功能（并且指定回程信息）
	bfd a bind peer-ip Y.Y.Y.Y source-ip X.X.X.X auto	
    // 把对应 BFD 传输地址反向配置即可
```
```
查看 BFD 信息
	display  bfd  session all 			
    
    // 可以查看 BFD 会话的摘要信息
    （加 verbose 可以查看详细内容，如：协议类型、协商时间等）
```

### 4、静态配置可以联动其他协议（如：VRRP、Static 等）
```
① 与静态路由协议联动
	ip route-static 0.0.0.0  0  10.1.13.3 track bfd-session a	
    // 绑定缺省路由，检测 BFD 会话（a）
		（当会话 a 失效，静态路由失效）

② 与 VRRP 联动
	interface G0/0/X						
    // 如：进入 G0/0/X 接口
	vrrp vrid 1 track bfd-session session-name a reduced  100	
    // 绑定 VRRP 组 ID（1），检测 BFD 会话（a）
		（当会话 a 失效，则降低 100 优先级）

```

### echo BFD（单臂回声）
```
    BFD 会话异步模式
        需要双方都支持 BFD 协议，才能建立会话
        （如果一端不支持 BFD 或者 没有运行 BFD ”运营商“ 
            则需要使用单臂回声检测）

    （查询模式，
        本端设备会发送 BFD 报文，到达对端接口后立刻响应，
        如果数据包能够回到原设备，代表 BFD 会话建立正常）
```
```
1、开启 BFD 功能
	bfd

2、配置会话信息
	bfd a bind peer-ip 10.1.13.3 interface G0/0/2 one-arm-echo		
    // 指定检测并往返的接口为（10.1.13.3）
	使用 G0/0/2 接口作为源接口进行检测（指定为单臂回声）

 	discriminator local 1000						
    // 指定本地标识符（必须指定，无法自行协商）
 	commit			// 使能以上配置

3、静态路由协议联动
	ip route-static 0.0.0.0  0  10.1.13.3 track bfd-session a	
    // 绑定缺省路由，检测 BFD 会话（a）
	（当会话 a 失效，静态路由失效）
```













