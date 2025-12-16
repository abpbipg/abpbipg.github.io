# IPv6 过渡技术

## IPv6
### 地址分类
```
单播：
    
1. 全球单播地址：类似于 IPv4 的公网地址，可以在全球范围路由
    
    固定前缀（001 /3bit）取值范围：
    2000—3FFF:XXXX:XXXX:XXXX……
    
    前 48bit 一般由运营商分配 + 16 bit 的子网 ID + 64 bit 的接口 ID 组成 128 位的 IPv6 地址
    
    如：2000:12::1/64、2000::1/64 等
    （一个接口可以有多个全球单播地址）


2. 链路本地地址：自动生成的 IPv6 地址，用于链路范围通信，无法跨越链路通信（常用于：无状态自动配置、路由器发现等）
        
    还能用于 OSPFv3 等动态协议的邻居建立，并且作为目的路由的下一跳地址
            
    固定前缀（FE80::/10bit）
    
    固定前缀 + 54 bit 的 0 + 64 bit 接口 ID 组成 128 位的 IPv6 地址
            
    如：FE80::1、FE80::

    链路本地地址只要接口 UP（支持 IPv6）就会自动生成，并且能够用于链路通信，接口必须有该地址，否则无法通信
            （该地址接口有且只能有一个）

    补充：
        EUI-64 可以使用接口的 MAC 地址生成 IPv6 的接口 ID（64bit）
        
        如：MAC 地址为： 0000-1111-2222
                    
            使用 EUI-64 生成  
            
            1. 把 0000-1111-2222 分成前后的 24 bit 
            
            0000-11   /   11-2222  ，在中间插入 FFFE
            
            2. 0000-11FF-FE11-2222，最后把前面的第 7bit 取反
            
            3. 0200-11FF-FE11-2222，变成 IPv6 接口 ID（200:11FF:FE11:2222）


3. 唯一本地地址：类似于 IPv4 的私网地址，可以在内部网络通信（无法在公网路由）
    
    固定前缀：FC00::/7   
    
    最后一个 bit 为 0 = FC00::/8  保留
    
    最后一个 bit 为 1 = FD00::/8  目前只采用了这个前缀作为唯一本地地址（前缀）

    固定前缀（8bit）+ 全球 ID（40bit）+ 子网 ID（16bit）+ 接口 ID（64bit）生成
            
        如：FD00::1/64
```
## 二、IPv6 过渡技术
```
初期：
    IPv4 和 IPv6 共存，且 IPv4 占据主导地位，一般会使用隧道或转换技术实现互通

中期：
    IPv6 占据主导地位，但依然存在少量的 IPv4 网络，会使用隧道技术实现 IPv4 和 IPv4 网络互联，传输隧道使用 IPv6 网络（如：SRv6）

后期：
    纯 IPv6 网络，完成过渡（使用 IPv6 协议传输）
```

### 1、双栈技术(同时支持IPv4 又 支持IPv6 协议栈)
```
设备既支持 IPv4 又支持 IPv6 协议栈，能够同时运行两种网络的设备（称为双栈设备）

    优点：
        简单，可以同时支持 IPv4 和 IPv6 网络工作
    缺点：
        需要维护两张网络，增加设备的负担和管理员运维压力
```

### 2、隧道技术
```
IPv6 over IPv4 ：把 IPv6 的流量封装到 IPv4 的上层，使用 IPv4 网络来传输 IPv6 的流量
```

#### 1. 手工隧道：隧道的源、目 IPv4 地址都需要手工指定，一条隧道只能有一个目的地址
```
IPv6 over IPv4 手工隧道：用于把 IPv6 流量封装到 IPv4 网络上

GRE 隧道：可以把任意的流量封装到 GRE 网络上（如：IPv4、IPv6、协议流量、组播流量等）
            补充：在 IPv6 over IPv4 场景中，GRE 会多一个 GRE 的通用头部

    优点：
        - 隧道可以承载任意流量（如：GRE）可以承载协议流量，
        - 用于构建 OSPFv3 等 IGP 协议邻居，学习路由
    
    缺点：
        - 隧道是 1:1 通信（一条隧道有且只能指定一个隧道目的地址）
        - 当站点过多的时候，需要维护大量的静态隧道，配置量大，且难以批量运维
```

#### 2. 自动隧道：隧道的源地址需要手工指定，目的地址可以通过其他方式获取（嵌套地址）一条隧道可以有多个目的地址
```
6 to 4 自动隧道：通过特殊 6 to 4 IPv6 地址来提取 IPv4 的隧道目的地址
    
    格式：2002 + IPv4 = 48 bit 特殊前缀，如：把 3.3.3.3 嵌套到特殊地址中（2002:303:303:: / 48 bit）

    （目的 IPv4 地址无需手工指定，可以通过 ping 的目的地址提取）

补充：
    6 to 4 中继（可以把普通的 IPv6 流量，通过 6 to 4 自动隧道封装，下一跳地址为 6 to 4 地址即可，可以实现 IPv4 目的的提取）

    优点：
        自动隧道可以自主提取目的 IPv4 地址，实现 1 对多的访问，减少隧道的配置和管理员运维压力

    缺点：
        无法承载组播流量（如：OSPFv3）无法动态建立 IGP 协议
```
			
#### 3.（自动隧道）6VPE
```
利用 IPv4 的 MPLS VPN 骨干网络，建立能够传输 IPv6 数据包的 MPLS VPN 隧道
（把 PE 设备称为 6VPE，能够承载 VPNv6 路由）

    优点：
        可以动态建立 MPLS LSP 隧道，又可以传递路由条目（减轻管理员的配置压力，同时拥有动态和静态隧道的优点）
    
    缺点：
        需要利用 MPLS VPN 网络（运营商骨干网络搭建）
```
			
				




配置命令
（IPv6 over IPv4 隧道）
一、IPv6 over IPv4 手工隧道
	隧道节点配置（AR1、AR3）

	略：AR1、AR2、AR3 需要运行任意的 IGP 协议，使其 loopback 接口可达
		（AR1 的：1.1.1.1/32 和 AR3 的：3.3.3.3/32）
	
	① 创建隧道，配置 IPv6 地址（AR1 为例）
		ipv6									// 全局开启 IPv6 支持该功能

		interface Tunnel0/0/0					// 创建 T0/0/0 隧道
 		tunnel-protocol ipv6-ipv4				// 隧道协议类型：IPv6 over IPv4

		ipv6 enable 							// 支持 IPv6 流量转发			
 		ipv6 address 2000:13::1/64 				// 配置 IPv6 地址
 		source 1.1.1.1							// 确定源、目 IPv4 隧道地址（该地址必须可达）
 		destination 3.3.3.3

		完成 AR1 和 AR3 配置后，隧道的 IPv6 地址可达

	② 需要配置中继（以上的流量只能实现隧道地址可达，无法实现其他 IPv6 地址可达）
		ipv6 route-static 2000:35::   64   Tunnel0/0/0			// 把到达 AR5 的流量，使用隧道传输


二、GRE 隧道
略：AR1、AR2、AR3 需要运行任意的 IGP 协议，使其 loopback 接口可达
		（AR1 的：1.1.1.1/32 和 AR3 的：3.3.3.3/32）
	
	① 创建隧道，配置 IPv6 地址（AR1 为例）
		ipv6									// 全局开启 IPv6 支持该功能

		interface Tunnel0/0/0					// 创建 T0/0/0 隧道
 		tunnel-protocol GRE					// 隧道协议类型：GRE

		ipv6 enable 							// 支持 IPv6 流量转发			
 		ipv6 address 2000:13::1/64 				// 配置 IPv6 地址
 		source 1.1.1.1							// 确定源、目 IPv4 隧道地址（该地址必须可达）
 		destination 3.3.3.3

		完成 AR1 和 AR3 配置后，隧道的 IPv6 地址可达

	② 需要配置中继（以上的流量只能实现隧道地址可达，无法实现其他 IPv6 地址可达）
		ipv6 route-static 2000:35::   64   Tunnel0/0/0			// 把到达 AR5 的流量，使用隧道传输



三、6 to 4 自动隧道
略：AR1、AR2、AR3 需要运行任意的 IGP 协议，使其 loopback 接口可达
		（AR1 的：1.1.1.1/32 和 AR3 的：3.3.3.3/32）
	
	① 创建隧道，配置 IPv6 地址（AR1 为例）
		ipv6									// 全局开启 IPv6 支持该功能

		interface Tunnel0/0/0					// 创建 T0/0/0 隧道
 		tunnel-protocol ipv6-ipv4 6to4			// 隧道协议类型：6to4 自动隧道

		ipv6 enable 							// 支持 IPv6 流量转发			
 		ipv6 address 2002:101:101::1/64 			// 把隧道的源 IPv4 地址嵌套到 6to4 中
 		source 1.1.1.1							// 确定源 IPv4 隧道地址

	② 静态路由配置（如：隧道用于访问 AR3 "AR3 的 IPv4 通信地址为：3.3.3.3/32"）
		ipv6 route-static  2002:303:303::3   64   Tunnel0/0/0

	③ 如果希望数据包能够通过 AR3 的 6to4 隧道访问后续的 2000:35::5 设备
		ipv6 route-static 2000:35::   64   2002:303:303::3 		 //  6to4 中继，当流量为：2000:35::5 时，数据包寻找 2002:303:303::3 的自动隧道转发
													      补充：相当于 IPv4 目的地址根据下一跳来提取



四、6VPE 隧道
	通过 IPv4 的核心网，传递 IPv6 的路由条目（运营商现有 IPv4 建立的 MPLS VPN 网络，仅需要利用现有的核心网络构建即可）
	MPLS VPN 本身也不需要获取路由信息，仅需要标签信息即可实现转发

	
配置命令
运营商设备（R1、AR3、R2）
1、内部接口使用任意 IGP 协议建立邻居关系，并学习接口 IP 地址
	略

2、R1、AR3、R2 建立 MPLS 及 LDP 邻居
	mpls lsr-id X.X.X.X							// 各自设备的 loopback0 接口地址
	mpls
	mpls ldp

	interface G0/0/X
	mpls
	mpls ldp									// 开启 MPLS 及 LDP 


3、R1 和 R2 建立 VPNv6 邻居（R2 配置参考）
	bgp 100									// 创建 BGP 进程，及 AS number
	router-id 1.1.1.1							// 需要手工指定 Router id
	undo default ipv4-unicast					// 删除 IPv4 单播信息

 	peer 1.1.1.1 as-number 100					// 指定对等体信息（R1）
 	peer 1.1.1.1 connect-interface LoopBack0		// 指定更新源
	
 	ipv6-family vpnv6							// 创建 VPNv6 协议簇
  	peer 1.1.1.1 enable							// 指定 R2 为 6PE 邻居


4、创建 IPv6 实例（R2 参考配置）
	ip vpn-instance B							// 创建实例 VRF-B
 	ipv6-family								// 设置实例协议簇（需要指定 IPv6 地址簇，默认为 IPv4 地址簇）
  	route-distinguisher 2:2						// 设置 RD
  	vpn-target 100:100 both					//  设置 RT（出入方向均为 100:100）


5、绑定 PE 连接 CE 的接口
	interface G0/0/X
	ipv6 enable
 	ip binding vpn-instance B					// 绑定后重新部署接口地址


6、PE 与 CE 建立 IPv6 BGP 邻居
	bgp 100
	ipv6-family vpn-instance B
	peer  2000:25::5 as-number 102				// 参考 R2 与 AR5 设备建立 EBGP 邻居


7、AR5 配置
	bgp 102
	router-id 5.5.5.5							// 需要手工指定 Router id
	peer  2000:25::5 as-number 100	

	ipv6-family unicast							// 参考 R2 与 AR5 设备建立 EBGP 邻居
	peer 2000:25::5 enable
	network 5::5 128							// 发布测试接口路由


	
	
















