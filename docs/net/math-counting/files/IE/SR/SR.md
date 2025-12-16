# Segment Routing

## 产生背景：
	① 传统的 MPLS  LDP 无法自行计算路径，需要根据 IGP 协议的开销来进行计算（只能根据开销选路）
		问题：开销更大的备份链路，不用于转发数据包（带宽浪费）
				依赖 IGP 协议，需要运行多种协议（如：IGP、LDP）
					IGP 和 LDP 如果未同步，可能会出现短暂的丢包

	② 使用 RSVP-TE 
		问题：端到端传输的所有设备都需要运行 RSVP 预留带宽（大量的信令流量占用带宽）
				预留的带宽没有使用也会被占用
					RSVP-TE 无法实现负载均衡


## 一、概念
### 1、Segment ID（SID）可以由 MPLS 的标签、IPv6 地址来进行标识，可以标识（如：站点、网络地址、网段、接口等信息）
```
		① Prefix SID（前缀段）可以用于标识 IP 前缀信息（如：192.168.1.0/24、100.1.1.1/32 等）一般用于标识目的路由
		② Node SID（节点段）是特殊的前缀段，必须是 32bit 的，用于全局唯一标识一台设备（如：1.1.1.1/32）
		补充：前缀段可以自动生成，一般手工配置（全局可见，全局有效，全局唯一。如：OSPF 中区域内所有的设备都能看到）

		③ Adjacency Segment（邻接段）Adj SID 是用于标识设备的接口或者是连接信息，本地有效
		（全局可见，本地有效，本地唯一，它只是本路由器标识接口使用，可以冲突）
```
### 2、Segment list 由多个 SID 组合的列表（有序排列）数据包会根据段列表来进行转发（逐跳转发）显式路径

### 3、SRGB（Segment Routing 预留全局标签）用于与其他标签协议区分，预留的标签仅能给 SR 使用



## 二、SR-MPLS 方案
### 1、SR-MPLS BE
	替代了 IGP + LDP 的方式生成转发路径（MPLS LSP）
	使用扩展的 IGP 协议（如：OSPF、IS-IS 来分配标签，无需再运行 LDP）
	可以避免大量的信息交互，也可以避免 IGP 和 LDP 不同步的问题，可以根据开销选路和实现负载均衡
	（补充：但是无法支持指定路径转发，只需要使用 Node 标签）

	OSPF 支持 SR-MPLS
	通过扩展的 LSA（Opq-Area：不透明的 LSA 来支持标签分配）
	① 携带 SRGB（16000 - 20000）
	② 携带 Node ID（10）						补充：通过 ① 和 ② 组合为 Node SID（16010）手工配置
	③ 携带 Adj SID（自动生成，也可以手工指定）	48080（标识着 NE1 的 E1/0/0 接口）


### 2、SR-MPLS TE
	替代了 IGP + LDP 的方式生成转发路径（MPLS LSP）
	使用扩展的 IGP 协议（如：OSPF、IS-IS 来分配标签，无需再运行 LDP）
	还可以指定严格路径和松散路径
		① 严格路径（Semgent list 由 adj SID 组成）每个接口都得按照标签转发
		② 松散路径（Semgent list 由 adj SID + Node SID 组成）可以选择不同接口转发，Node SID 可以实现负载均衡
		补充：SR-MPLE TE 无法同时指定多条路径（如：优先选择显式路径1，故障后选择显式路由2）


### 3、SR-Policy
	替代了 IGP + LDP 的方式生成转发路径（MPLS LSP）
	使用扩展的 IGP 协议（如：OSPF、IS-IS 来分配标签，无需再运行 LDP）
	相比于 SR-MPLS TE（Policy 更加灵活）

		① 源 IP 地址（代表设备发送出去的源地址）
		② Endpoint（代表目的地址，流量要到达的目的设备）
		③ color（标签，用于区分到达同一个目的地的不同业务，或流量）
		补充：② 和 ③ 共同标识一条流量	

	
SR-MPLS 可以手工配置，也能动态下发
动态下发需要使用 3 种协议
	① BGP-LS（link state）用于收集网络中链路的带宽、延迟、拓扑信息等内容，并反馈给服务器	
	② 服务器（控制器）通过 BGP-LS 收集的信息，可以制定转发策略（生成 Segment list）	
	③ 通过 NETCONF 协议下发到指定的网络设备上



## 三、SR-MPLS 的可靠性保障
### 1、FRR（快速从路由）传统的 FRR + LFA 算法可以提供设备的路径备份，但存在局限性
		设备收敛速度不一样可能会导致临时环路

### 2、TI-LFA 算法
		TI-LFA借助SR源路由规划能力，在每个节点都会计算备份路径保护故障点。当节点检测到故障时，快速切换到备份路径
		但 T1-LFA 算法还存在局限性，对于 SR 隧道中的指定必经节点（首节点、尾节点、路径约束节点）故障，TI-LFA无法生成保护

		补充：通过Anycast FRR可以实现对于指定节点的故障保护
			   类似于 VRRP 设备，把多个设备的 Node SID 设置一样，作为冗余设备

### 3、SR 的 Hot-Standby 就是通过控制器算出一条与主路径不同的备份路径，实现端到端的路径保护。
		SR-MPLS Policy 由主候选路径和备候选路径形成 Hot-Standby，主、备候选路径属于一个 SR-MPLS Policy






## 配置命令
### 段路由配置：
（SR-MPLS BE）
所有 NE 设备均关闭 DCN
 undo dcn

#### 1、PE 设备使用 OSPF 或 IS-IS 建立 IPv4 邻居关系，并使得各自 loopback0 接口可达

#### 2、开启 MPLS 及 SR 协议
 mpls lsr-id 1.1.1.1                                                                           // 开启 MPLS 及配置 LSR-ID
 mpls

 segment-routing                                                                             // 开启段路由

#### 3、开启协议支持
（OSPF 协议）
 ospf router-id 1.1.1.1                                                                     // 进入 OSPF 进程
 opaque-capability enable                                                             // 开启 10类 LSA 扩展能力
 segment-routing mpls                                                                   // 配置段路由使用 MPLS 标签
 segment-routing global-block 16000 26000                             // 配置段路由全局段 ID 范围（16000—26000）

#### 4、进入设备 loopback0 接口指定站点段
 interface LoopBack0
 ospf prefix-sid index 10                                                                 // MPLS 域设备均需要开启，指定设备标识（10，可以生成 16010 站点段 ID）

#### 5、配置 vpn-instance 用于区分用户路由
 ip vpn-instance A                                                                           // 创建相关实例
 ipv4-family
 route-distinguisher 1:1                                                                 // 指定 RD 值（RD 值不能一致）
 vpn-target 100:100 export-extcommunity                               // 指定 RT 值（RT 值需要私网交叉）
 vpn-target 100:100 import-extcommunity

#### 6、PE 之间建立 VPNv4 邻居
 bgp 100                                                                                           // 进入相关 AS
 undo default ipv4-unicast                                                           // 关闭 IPv4 默认配置
 peer 3.3.3.3 as-number 100                                                       // 指定 PE 设备建立邻居
 peer 3.3.3.3 connect-interface LoopBack0

 ipv4-family vpnv4                                                                         // 创建 VPNv4 地址簇，并建立 VPNv4 邻居
 policy vpn-target
 peer 3.3.3.3 enable

#### 7、PE 与客户 CE 建立 BGP 邻居
 ipv4-family vpn-instance A
 peer 10.1.14.4 as-number 400                                                   // 建立实例邻居（也可以使用其他 IGP 协议代替）

#### 8、指定 BE 隧道多路径
 tunnel-policy NE1                                                                       // 创建隧道策略，名称：NE1
 tunnel select-seq sr-lsp load-balance-number 2                    // 指定使用 SR-LSP 实现隧道负载均衡，数量：2（默认 SR-LSP 顺序越前越优先）
                                                                                 
默认情况下，PE 设备使用 LSP 隧道作为转发隧道，如果存在多条 LDP LSP 隧道，可以实现负载分担
但网络中只存在 BGP LSP ，BGP 路由仅会选择带 > 的最优路径进行转发，无法负载分担
如果网络中只存在 SR LSP，则系统会选择 SR LSP 作为转发隧道，如果存在多条 SR LSP，可以实现负载分担

 ip vpn-instance A                                                                           // 使能实例 A 路由根据隧道策略 NE1 进行负载分担
 tnl-policy NE1


### 查看命令：
① 查看 SR-MPLS 隧道
display tunnel-info all

② 查看 BGP 为目的路由分配的 prefix segment ID
display bgp vpnv4 all routing-table labe


### （IS-IS 协议）
把步骤 3、4 修改为 IS-IS 协议即可，其他配置一致
 is-is 
 cost-style wide												// IS-IS 必须使用宽度量支持 SR-MPLS 或 SRv6
 segment-routing mpls
 segment-routing global-block 16000 26000                                                // 建立 IS-IS 邻居，并且开启度量模式（支持 SR-MPLS 功能，及配置全局段 ID）

进入设备 loopback0 接口指定站点段
 interface LoopBack0
 isis prefix-sid index 10                                                                 			// MPLS 域设备均需要开启，指定设备标识（10，可以生成 16010 站点段 ID）





### （SR-MPLS TE）
所有 NE 设备均关闭 DCN
 undo dcn

#### 1、PE 设备使用 OSPF 或 IS-IS 建立 IPv4 邻居关系，并使得各自 loopback0 接口可达

#### 2、开启 MPLS、MPLS-TE 及 SR 协议
 mpls lsr-id 1.1.1.1                                                                           // 开启 MPLS 及配置 LSR-ID
 mpls
 mpls te                                                                                            // 开启 MPLS-TE 功能

 segment-routing                                                                             // 开启段路由

#### 3、开启协议支持
（OSPF 协议）
 ospf router-id 1.1.1.1                                                                     // 进入 OSPF 进程
 opaque-capability enable                                                             	// 开启 10类 LSA 扩展能力
 segment-routing mpls                                                                  // 配置段路由使用 MPLS 标签
 segment-routing global-block 16000 26000                             	// 配置段路由全局段 ID 范围（16000—26000）

 area 0
 mpls-te enable                                                                               // 进入区域 0（发布接口相应的区域）开启 MPLS-TE 通告能力

#### 4、进入设备 loopback0 接口指定站点段
 interface LoopBack0
 ospf prefix-sid index 10                                                                 // MPLS 域设备均需要开启，指定设备标识（10，可以生成 16010 站点段 ID）

#### 5、配置 vpn-instance 用于区分用户路由
 ip vpn-instance A                                                                          // 创建相关实例
 ipv4-family
 route-distinguisher 1:1                                                                 // 指定 RD 值（RD 值不能一致）
 vpn-target 100:100 export-extcommunity                               	// 指定 RT 值（RT 值需要私网交叉）
 vpn-target 100:100 import-extcommunity

#### 6、PE 之间建立 VPNv4 邻居
 bgp 100                                                                                          // 进入相关 AS
 undo default ipv4-unicast                                                           	// 关闭 IPv4 默认配置
 peer 3.3.3.3 as-number 100                                                       	// 指定 PE 设备建立邻居
 peer 3.3.3.3 connect-interface LoopBack0

 ipv4-family vpnv4                                                                         // 创建 VPNv4 地址簇，并建立 VPNv4 邻居
 policy vpn-target
 peer 3.3.3.3 enable

#### 7、PE 与客户 CE 建立 BGP 邻居
 ipv4-family vpn-instance A
 peer 10.1.14.4 as-number 400                                                   	// 建立实例邻居（也可以使用其他 IGP 协议代替）

#### 8、指定隧道路径为 SR-TE 隧道
 tunnel-policy NE1                                                                         	// 创建隧道策略，名称：NE1
 tunnel select-seq sr-te load-balance-number 1                     	// 指定使用 SR-TE 隧道进行转发，数量：1
                                                                                 
 ip vpn-instance A                                                                         	// 使能实例 A 路由根据 NE1 策略转发（即：使用 SR-TE 隧道转发）
 tnl-policy NE1

#### 9、指定显式路径
 explicit-path NE1                                                                         	// 指定显示路径，名称：NE1
 next sid label 16020 type prefix                                               	// 下一跳站点选择（node segment 为：NE2 及 NE3）
 next sid label 16030 type prefix                                               	// 必须指定节点 NE3（NE2 可以不指定，因没有配置 SR-TE 隧道）

#### 10、NE1 及 NE3（PE 设备）需要指定 MPLS TE 隧道
 interface Tunnel1
 ip address unnumbered interface LoopBack0                                                  // 使用 loopback0 接口地址作为隧道源 IP 地址（node segment 为：16010）
 tunnel-protocol mpls te                                                                                   // 隧道模式为：MPLS-TE
 destination 3.3.3.3                                                                                                 // 指定隧道目的 IP 地址（NE3）对端 PE 设备（也可以是中转设备，如：NE2）
 mpls te signal-protocol segment-routing                                                          // MPLS-TE 使用 SR 方式发现
 mpls te tunnel-id 1                                                                                                // 指定 MPLS-TE 隧道 ID
 mpls te path explicit-path NE1                                                                            // MPLS TE 路径为 NE1 策略（显式路径转发）

#### 指导数据包使用 SR 的 MPLS-TE 进行转发
查看命令：
① 查看 SR-MPLS 隧道
display tunnel-info all

② 查看 BGP 为目的路由分配的 prefix segment ID
display bgp vpnv4 all routing-table labe




## SR-Policy 配置
### 一、基础配置
1、所有的 NE 路由器都需要配置接口 IP 地址，并且配置一个 loopback0 接口地址
2、使用 OSPF 或 IS-IS 协议使 loopback0 接口能够互访
3、运行 MPLS，LSR-ID 为 loopback0 接口地址

### 二、SR-Policy 配置
#### 1、所有的 NE 路由器开启 MPLS TE 功能和 SR 功能
	mpls
	mpls te
	
	segment-routing
	
#### 2、所有的 NE 路由器进入 OSPF 开启不透明 LSA 及 SR 功能
          ospf
	 opaque-capability enable
	 segment-routing mpls                                                                                                           // 开启 SR-MPLS 功能
	 segment-routing global-block 16000 32000                                                                     // 设置 SRGB 范围（16000—32000）

#### 3、所有的 NE 路由器进入 loopback0 接口开启 SR prefix 功能
            interface loopback0
	 ospf prefix-sid index 10

#### 4、所有的 NE 路由器均需要配置连接段地址及标签
	segment-routing
	ipv4 adjacency local-ip-addr 10.1.12.1 remote-ip-addr 10.1.12.2 sid 321612                    // 参考 PE1（连接 P2 及 PE4 设备）
	ipv4 adjacency local-ip-addr 10.1.14.1 remote-ip-addr 10.1.14.4 sid 321614                    补充：注意接口 IP 地址
	
#### 5、NE1 和 NE4 设备（PE 设备）配置转发路径及 SR-policy
	segment-routing                                                                                                                             // 进入 SR
	segment-list 1                                                                                                                                 // 配置 SR-list（名称：1）路径 1
	index 10 sid label 321612                                                                                                             // 指定 ADJ 标签（即：接口信息）
	index 20 sid label 321623
	index 30 sid label 321634
	
	sr-te policy 1 endpoint 4.4.4.4 color 104                                                                                    // 配置 SR-policy，名称：1  目的地址为：4.4.4.4 颜色 104
	candidate-path preference 100                                                                                                    //  指定 SR-policy 优先级
	segment-list 1                                                                                                                                  //  绑定路径 1 
	
#### 6、NE1 和 NE4 设备（PE 设备）建立 VPNv4 邻居
	bgp 100
	peer 4.4.4.4 as-number 100
	peer 4.4.4.4 connect-interface LoopBack0

	ipv4-family vpnv4
	peer 4.4.4.4 enable

#### 7、PE 创建 vpn-instance 与 CE 互联，并且为 CE 路由打上相关的 color
	ip vpn-instance A
	route-distinguisher 1:1                                                                                                           // 指定 RD 和 RT（注意：RT 值）
	vpn-target 100:100 export-extcommunity
	vpn-target 100:100 import-extcommunity
	
	interface Ethernet3/0/2                                                                                                         // 绑定相关接口并配置 IP 地址（与 CE 互联接口）
	ip binding vpn-instance A
	ip address 10.1.11.1 24
	
	route-policy color permit node 10                                                                                       // 配置 Route-policy 策略（为 CE 路由打上 color）
	apply extcommunity color 0:104                                                                                          // 扩展团体属性，color 0:104
	
	bgp 100
	ipv4-family vpn-instance A
	peer 10.1.11.11 as-number 200
	peer 10.1.11.11 route-policy color import                                                                        // 进入 BGP 并建立邻居，同时调用 color 策略

#### 8、配置隧道策略
	tunnel-policy 1
	tunnel select-seq sr-te-policy load-balance-number 1 unmix                                        // 配置策略隧道 1，并指定负载均衡隧道为 1
	
	ip vpn-instance A                                                                                                                    // 进入实例并绑定隧道策略
	tnl-policy 1

#### 9、CE 设备配置（略）
	建立 BGP 邻居即可，发布测试路由
	
	查看配置命令
	display  segment-routing adjacency mpls forwarding                            // 查看 PE、P 设备接口连接段信息
	display bgp vpnv4 all  routing-table  X.X.X.X 32 verbose                        // 查看业务路由拓展团体属性信息和标签信息
	display bgp vpnv4 all  routing-table extcommunity                               // 查看业务路由 color 信息
	display tunnel-info all                                                                              // 查看隧道信息
	display  ip routing-table vpn-instance A X.X.X.X 32 verbose                  // 查看 PE 业务路由明细信息，是否递归隧道
