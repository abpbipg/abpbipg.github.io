# IPv6 路由技术
```
当 IPv6 网络占据主导地位，或大量的 IPv6 设备出现就需要使用 IPv6 的路由协议来学习地址
```
## 一、路由协议
```
	IGP（OSPFv3、IS-IS）
	
	BGP（BGP4+）
```

## 二、OSPFv3
```
OSPFv2 支持 IPv4 网络，OSPFv3 支持 IPv6 网络，两者均不能兼容
	（OSPFv3 是一个新的协议）相比于 OSPFv2

	相同部分
		① 报文类型：Hello、DD、LSR、LSU、LSACK
		② 网络类型：BMA、P2P、NBMA、P2MP
		③ 状态机：Down、Init、2way、Exstart、Exchange、Loading、Full （特殊状态：Attempt，只在 NBMA 网络类型出现）
		④ 区域类型：骨干、普通、特殊（STUB、NSSA）
		⑤ 设备类型：IR（区域内部路由器）、BR（骨干区域路由器）、ABR（区域边界路由器）、ASBR（自治系统边界路由器）
		⑥ SPF 算法一致（Full-mush SPF、I-SPF、PRC）开销计算方式也一致（根据参考带宽 / 接口实际带宽得出）

	不同部分
		① OSPF 报文的头部字段
		② LSA 类型（新增了 8、9 类 LSA）且 1、2 类 LSA 不在携带网络信息
		③ 不支持认证（由 IPv6 头部提供认证，如：AH、ESP）
		④ 支持多实例，可以实现接口的复用（提高链路利用率）
```

### 概念（不同点）
```
1、OSPFv3 工作在链路上（使用链路本地地址建立邻居关系）不再使用 IP 地址来标识接口（不再工作在网段上）
		补充1：OSPFv2 工作在网段上，如：BMA、P2P、NBMA 必须相同掩码才能建立邻居（相同的网段）
		补充2：OSPFv3 使用链路本地地址建立邻居关系，所以处于直连的链路即可完成邻居关系的建立
```
```
2、OSPFv3 不再支持认证功能，移除了头部的认证字段（① 认证类型 ② 认证载荷）
		OSPFv3 把该字段的空间，添加为 instance  ID（实例）
		作用：提高链路的利用率，可以实现一条链路允许多个不同的 OSPFv3 邻居

		补充：OSPFv3 所有的数据包都会包含一个 OSPFv3 的头部，头部的 instance 字段可以判断数据包应该发给哪一个实例
			  只有相同实例的设备才会处理相互发送的数据包，不同实例直接丢弃
```
```
3、OSPFv2 和 OSPFv3 都使用 Router id 唯一的标识一台 OSPF 设备
		OSPFv2 可以使用接口 IP 地址来自动生成 Router id（因为 Router id 与 IPv4 地址格式一致，点分十进制）
		补充：OSPFv3 必须手工指定 Router id，否则无法自动生成，导致邻居无法建立
```
```
4、OSPFv3 使用 interface ID 来标识自己的接口，每个接口都会分配一个 interface ID（唯一的标识一个接口，interface ID 本地有效）
		 补充：部分接口没有 interface ID（如：loopback0）
		 该 ID 一般携带在 Hello 报文中，LSA 也会通过 interface ID 来标识邻居连接的接口（不使用 IP 地址标识）
```

### ** LSA 的不同点
```
	1、LSA 头部
		Type 字段扩展为了 16 bit，其中前 3 bit 代表对未知 LSA 处理和泛洪范围
		U / S1 / S2		
			① U 代表对未知 LSA 的处理，0 代表识别的 LSA   1  ； 代表不识别的 LSA（可以本地保留和链路泛洪）
			② S1 代表 domain 泛洪	（整个 OSPFv3 协议）
			③ S2 代表 area 泛洪	（只在 OSPFv3 区域内或区域间）

			128 / 64 / 32（S1 = 64、S2 = 32）  剩余的 13 bit 为 LSA 类型
				0x20（代表 32）区域泛洪
				0x40（代表64）domain 泛洪

			如：0x2001、0x2002、0x2003、0x2004、0x2007（代表 LSA 1、2、3、4、7 区域泛洪）
			       0x4005（代表 LSA 5，整个 OSPFv3 泛洪）
```
```
	2、新增了两种 LSA（0x0008、0x2009）8类（链路泛洪） 和 9类（区域泛洪）LSA

		Link LSA（0x0008）8类 LSA
		（OSPFv3 设备为自己的接口产生（物理接口或 Vlanif）描述接口的网络信息）
			① interface ID
			② link-local address（链路本地）
			③ prefix address（全球单播、唯一本地）
			传递范围：链路上（一个接口的范围）

		Intra-Area-Prefix（0x2009）9类 LSA
		（OSPFv3 设备为自己的网络信息产生，如：Router LSA、Network LSA 中的网络信息）
			① 路由前缀（Prefix Address）
			② 前缀长度（掩码）
			③ 类型（type 0x2001、0x2002）代表为 Router LSA 或者是 Network LSA 产生
			④ 开销（cost）
			传递范围：区域内部（一个区域内传递）
```
```
3、1类 和 2类 LSA 不在携带网络信息
*** Router LSA
	OSPFv2（携带本设备的 "拓扑信息" 和 "网络信息" ）
			当添加一个 loopback 接口，也会产生新的 Router LSA（需要执行 I-SPF 计算，因为 LSA 中包含拓扑信息）

	OSPFv3（只携带本设备的  "拓扑信息" ）
			网络信息不在存放 Router LSA 中，存放在 Link-LSA 和 Intra-Area-Prefix LSA
			补充：拓扑信息和网络信息分离，如果拓扑变化则执行 I-SPF 计算，网络变化则只需要执行 PRC 计算即可）
			（使用 8、9 类 LSA 携带网络信息）

*** Network LSA
	OSPFv2（携带本设备的 "拓扑信息" 和 "网络信息" ）

	OSPFv3（只携带本设备的  "拓扑信息" ）
			网络信息不在存放 Router LSA 中，存放在 Link-LSA 和 Intra-Area-Prefix LSA

	补充：
	在 BMA、NBMA（在 MA 网络类型）DR 设备会通过 8类 LSA 收集公共网段的所有接口地址信息
	收集完成后，由 DR 统一生成 9 类 LSA 携带，并传递给其他链路的设备
	（如：AR1、AR2、AR3，其中 AR3 为 DR 设备，AR1、AR2、AR3 接口上的 IPv6 地址信息，统一由 AR3 产生的 9 类传递，AR1 和 AR2 不产生 9 类 LSA）
		  这种 9类 LSA 会携带 0x2002 的标识，代表是 DR 汇聚产生的

	（如：AR1 还有一个 loopback0 接口，地址为：100::100/128  这个接口在 OSPFv2 中会以 STUB 形式产生）
		这种 9类 LSA 可以由 AR1 自行产生，显示为 0x2001 代表是 STUB 类型（在 Router LSA 中转换过来的）
```

	
### 配置命令
```
1、创建 OSPFv3 进程
	ospfv3  1						// 配置 OSPFv3 并指定进程 1
	router-id X.X.X.X				// 必须手工指定 Router ID 否则无法建立邻居关系

2、进入接口配置 IPv6 信息及发布接口
	ipv6							// 全局支持 IPv6 功能

	interface G0/0/X
	ipv6 enable
	ospfv3 1 area 0				// 把 G0/0/X 发布到 OSPFv3 的进程 1 区域 0 中（默认：instance 为 0）
								    补充：不同的 instance ID 无法建立邻居关系

3、完成配置后查看邻居
	display ospfv3 peer brief


补充：创建 ACL 2000 过滤路由
	acl ipv6  2000  						// 创建 IPv6 的 ACL 2000（基础 ACL）
 	rule 5 permit source 1::1/128 			// 允许 1::1/128 路由通过
 	rule 10 deny source 2000:12::/64 			// 拒绝 2000:12::/64 路由通过（不需要配置通配符）
	rule 20 permit source any				（没有允许的路由默认拒绝，添加通行条）


	OSPFv3
	area 1	
	filter  2000 import						// 禁止 ACL 2000 匹配到的路由进入区域 0（1::1/128 可以接收，2000:12::/64 拒绝接收）


	OSPFv3
	area 2
	nssa									// 把区域 2 修改为 NSSA 区域
	
	其他命令与 OSPFv2 类似
```	

## 三、IS-IS
```
	IS-IS 不需要切换版本，只需要更新 TLV 即可支持 IPv6（类似于给协议打上新的补丁）
	IS-IS 既可以支持 OSI 模型又可以支持 TCP/IP 模型，称为集成的 IS-IS，支持 IPv4 是通过 TLV 来承载路由，在 IPv6 过渡中，只需要添加新的 TLV 即可
	（扩展性强）

		IPv4
			① TLV=132（承载 IPv4 的接口地址）通告接口信息（IIH、LSP 都会存在）
			② TLV=128（承载 IPv4 的路由信息，如：路由前缀、掩码、开销等信息）

		IPv6
			① TLV=232（承载 IPv6 的接口地址）"相当于 IPv4 的 132 TLV"
				如果是 IIH（仅携带接口的链路本地地址，如：FE80::1）
				如果是 LSP（携带非链路本地的其他接口地址，如：2000::1、FD00::1 等）

			② NLPID（网络层协议标识符）协议字段中会添加 IPv6（代表对 IPv6 网络的支持）
						0xcc（IPv4）0x8e（IPv6）

			③ TLV=236（承载 IPv6 的路由信息）如：路由前缀、前缀长度、开销及 Sub-TLV  " 相当于 IPv4 的 128 和 130"
					补充：flags（U = up/down bit 用于防止路由回灌，在 Level-2 引入到 Level-1 的路由都会打上该 bit，打上后无法重新回传到 Level-2）
								X = 路由标识位，X = 0 代表是内部路由、X = 1 代表是引入（import）的外部路由
								S = 子 TLV 支持位，如果等于 1 代表支持扩展的子 TLV（如：tag）
```				
```
IS-IS 默认情况下 IPv4 和 IPv6 网络共享一张拓扑（ST 单拓扑）
	ST 是利用 IPv4 的接口开销值来进行计算的最短路径树
	问题1：根据 IPv4 的开销计算，IPv6 的转发路径不一定是最优的，可能会出现次优路径问题
	问题2：根据 IPv4 的路径转发，如果中间有设备不支持 IPv6 可能还会导致数据丢包问题（IPv6 数据包无法转发）
```
```
解决办法：开启多拓扑（MT）让 IPv4 和 IPv6 的网络，各自计算最短路径树
	使用不同的 TLV 来承载 IPv4 和 IPv6 的拓扑计算信息
	① TLV = 229（多拓扑标识）代表 IS-IS 设备目前支持的拓扑类型
		0x000 代表 IPv4 单播拓扑
		0x002 代表 IPv6 单播拓扑

	② TLV = 222 携带 IPv6 的邻居信息（邻居的 system id 和 cost ）拓扑信息（用于构建 IPv6 的 SPF-Tree）
		
	③ TLV = 237 携带 IPv6 的路由信息（多拓扑路由，类似于 236）
```

### 配置命令
```
	前置命令
		ipv6										// 系统视图开启 IPv6

	① 创建进程
		isis 1
 		is-level level-2								// 可选（修改等级）
 		cost-style wide							// 可选（修改度量值）所有的设备必须保持一致的度量值
 		network-entity 49.0001.0000.0000.0001.00		// 设置设备的区域 ID、系统 ID、NET 标识
 
 		ipv6 enable topology ipv6					// 开启 IPv6 多拓扑
		ipv6 enable								// 开启 IPv6 和 IPv4 单拓扑

	② 接口发布
		interface G0/0/X							// 进入接口
		ipv6 enable								// 开启 IPv6 功能
		ipv6 address 2000:12::1/64					// 配置接口 IPv6 地址
		isis ipv6 enable							// 把该接口发布到 IPv6 的 IS-IS 中

		isis enable								// 该命令只能发布 IPv4 的地址到 IS-IS（注意识别）
												    在 IPv6 网络中无需配置

	③ 其他命令于 IPv4 类似
		interface G0/0/X
		isis ipv6 cost 100							// 修改 IPv6 的 IS-IS 接口开销
 		isis circuit-type p2p						// 修改后 IPv4 和 IPv6 的接口类型均改为 P2P 模式（无法单独修改 IPv4 和 IPv6 的接口模式）
		
	查看 IS-IS 邻居
		display isis peer							// 查看邻居状态	
		display  isis route ipv6 						// 查看 IS-IS IPv6 路由	
		display  isis lsdb							// 查看 IS-IS 数据库
```

## 四、BGP
```
	BGP 类似于 IS-IS 通过扩展属性支持（MP-REACH-NLRI 和 MP-UNREACH-NLRI 来支持路由的更新和撤销）
	MP-BGP 本身就是支持多种协议类型的协议，通过更新 TLV 结构的地址簇即可
	（支持的协议多，如：IPv4、IPv6、EVPN、VPNv4、VPNv6 等）

	BGP 通过扩展协议簇来支持 IPv6
	1、在 OPEN 报文中会协商支持的协议簇，双方都支持的情况下，则可以建立邻居关系，否则会收到 Notification 中断 TCP 对等体
		AFI = 地址簇信息		（1 = IPv4）（2 = IPv6）
		SAFI = 子地址簇信息	（1 = 单播）（2 = 组播）（128 = VPN）

	2、使用 MP-REACH-NLRI 携带扩展的路由信息
		如何标识携带的是什么路由？使用 AFI 和 SAFI 标识（所以在 Updata 的字段中也有该标识，标识携带的是哪种协议的路由）
		
		使用 MP-UNREACH-NLRI 来撤销路由，同样会携带 AFI 和 SAFI 信息

		MP-BGP 通过扩展地址簇来支持不同的协议，无需修改版本也其他参数
		报文类型、工作过程都一致，特性也一致（如：IBGP 水平分割、防环和其他选路属性一致）
```

### 配置命令：
```
	bgp 100								// 创建 BGP 进程（AS 100）
 	router-id 2.2.2.2						// 必须手工指定 router id（IPv6 地址无法充当 Router id）
 	peer 2000:12::1 as-number 100 			// 指定邻居和 AS 号

 	ipv6-family unicast						// 创建 IPv6 的单播地址簇
	peer 2000:12::1 enable					// 使得邻居生效

	其他可选配置
	ipv6-family unicast						// 进入 IPv6 的单播地址簇
	network 2::2 128 						// 发布路由

	peer 2000:12::1 route-policy A import		// 如修改属性值（route-policy A 配置省略）

  	peer 2000:12::1 reflect-client				// 指定 2000:12::1 为客户机

	查看邻居和路由
		display bgp ipv6 peer

		display bgp ipv6 routing-tabel
```



















