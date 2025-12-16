# 一、MPLS VPN
```
	传统的 MPLS 需要运行 IGP 协议和 LDP 协议，才能分配标签隧道（LSP）
	① IGP 和 LDP 的收敛问题，导致数据包转发失败
	② 需要维护多种协议（IGP 和 LDP）
	③ 需要交互大量的信令信息（协议报文）
	④ 设备必须支持 MPLS 转发
	⑤ 无法支持应用选路，根据 IGP 协议的开销来自行计算


	SR-MPLS 解决了以上的问题
	① 使用 IGP 分配标签，无需运行 LDP 协议（BE）
	② 使用 SR-MPLS-TE 或 SR-policy
	③ SR-MPLS 相比于 MPLS-TE，可以支持负载均衡
```

# 二、SRv6
```
	SRv6 是通过 IPv6 网络来支持转发的，标签（locator id）均为 IPv6 地址
	SRv6 使用 IPv6 的地址充当标签，并封装再 SRH 中进行转发

	优点：
		① 不在需要封装 MPLS 的标签字段，简化了转发平面（减少标签查表）
		② 中转设备只需要支持 IPv6 转发即可，可以兼容存量网络（可以保护已有投资）
		③ 控制平面延续了 SR-MPLS，仅需要 IGP 协议即可传递 SRv6 信息
		④ 加入了操作码（支持编程能力）
```

### 概念
#### 1、Segment 是由 IPv6 地址来进行标识的，长度为 128 bit，不足的部分使用 0 补充
```
    由 Locator + Function 组成，也可以添加 Arguments 	
	补充：可以称为 SRv6 SID
```
#### 2、Locator id 类似于 IPv6 地址前缀
```
    如：2000:1::/96
	剩余的部分可以手工静态生成，也可以协议生成
```
#### 3、Function 可以标识设备的转发方式和标签处理方式
```
    end（代表设备节点）（end-x 代表一个三层次接口）（end-op 代表弹出 SRH 转发）（end-dt4 代表 IPv4 的 vpn-instance 接口）

	例1：Locator id（2001::/96）为 AR1 的标识，代表前缀为 2001::/96 的流量都转发到 AR1 设备上
			end 												代表 AR1 设备站点
			end-x 代表 AR1 									设备上的一个三层接口（x 代表一个或一组三层接口）
			end-dt4 代表 AR1 上的一个 IPv4 接口（带 vpn-instance）	dt4 （D 代表解封装，弹出 IPv6 头部和 SRH）（T 代表查找路由表转发）（4 代表 IPv4）

			https://support.huawei.com/hedex/hdx.do?docid=EDOC1100331623&id=ZH-CN_CONCEPT_0197730816
			（end 的组合，及意义）
```

#### 4、设备角色
```
    源节点：封装 SRv6 报文的起源设备（一般会根据 Segment list 封装 SRH）
	中转节点：不支持 SRv6 功能或处理的设备，但支持 IPv6 转发
	Endpoint：支持 SRv6 功能及处理的设备，一般为中间或目的设备（P、PE 设备）
```

# 二、SRv6 转发模式
## 1、SRv6 BE
```
    设备根据路由的开销值选路，无法进行精确控制
	在 VPNv4 网络中，BE 只使用了 end.dt4 和 end.dt6 的功能（用于标识一个 vpn-instance）
	选路控制根据 BGP 建立邻居的 IPv6 地址来转发，根据底层 IGP 协议开销选路
```

## 2、SRv6 policy
```
    通过编写 Segment list 来进行路径编排，实现灵活的流量工程和转发控制
	同时配合控制器可以更好地响应业务的差异化需求做到业务驱动网络（即：策略引导转发）

	补充：SRv6 SID 可以通过 SRH 封装到 IPv6 扩展头部中，并根据编排的 SL 来封装目的 IPv6 地址
	转发过程中经过 endpoint 站点即可替换目的 IPv6 地址，实现转发路径的控制
```

### 确保 SRv6 可靠性
#### 1、故障发现（BFD 和 SBFD）
```
    BFD 一般是用于 IGP 协议邻居间，发现故障（一般是设备与设备间建立，相邻设备间建立）
	缺陷（需要建立大量的 BFD 会话，设备无法得知传输路径上所有的情况）
```
#### 2、SBFD 可以减少邻居 BFD 的配置，通过反射点实现 SRv6 路径的检测
```
    补充：可以同时检测主、备或多路径
```
#### 保护机制
```
TI-LFA：可以在中间插入一个新的 SRH 头部，到达备用节点（P/Q 空间的转发节点）跳过故障的链路进行转发

VPN FRR：生成两条不同的转发路径，当主路径故障可以实现快速切换（能够实现端到端的保护）
	
```



# 三、配置命令
## SRv6 BE 配置
```
1、所有设备关闭 DCN 实例
undo  dcn

2、配置 IS-IS 邻居
 isis 1                                                                                        // 创建 IS-IS 进程 1
 is-level level-2                                                                       // 设置设备等级（level-1 或 level-2 均可，推荐骨干网络采用 level-2）
 cost-style wide                                                                      // 设置宽度量支持
 network-entity 49.0001.0000.0000.0001.00                  // 配置 NET 地址
 ipv6 enable topology ipv6                                                  // 开启 MT 功能（使得 IS-IS 设备支持 IPv6 路径计算及转发）

3、配置 SRv6 locator 标识
 segment-routing ipv6                                                         // 开启 SRv6 支持
 encapsulation source-address 1::1                                  // 设置 SRv6 头部地址（1::1 即：loopback0 接口地址）
 locator LSW4 ipv6-prefix 2000:14:: 64 static 32            // 设置 locator 前缀标识（2000:14::/64 前缀标识，用于标识站点）static 标识为 32 位
                                                                            （locator + function 生成）不足 128 bit 使用 0 补充
opcode ::111 end                                                         // 手工补充站点 ID（end 代表本地站点）

4、配置站点标识
 isis 1                                                                                        // 进入 IS-IS 进程 1
 segment-routing ipv6 locator LSW4                                 // 使用 LSW4 locator 前缀标识本设备

5、创建 vpn-instance 
 ip vpn-instance A
 ipv4-family
 route-distinguisher 1:1
 vpn-target 100:100 export-extcommunity
 vpn-target 100:100 import-extcommunity                     // 用于区分客户地址空间

6、PE 设备建立 VPNv4 邻居
 bgp 100
 router-id 1.1.1.1                                                                 // IPv6 地址无法自动生成 router-id（需要手工配置）
 peer 3::3 as-number 100
 peer 3::3 connect-interface LoopBack0                         // 使用 loopback0 接口地址建立 VPNv4 邻居（类似于 VPNv4-6PE）
 
 ipv4-family vpnv4                                                               // 进入 VPNv4 实例，使能邻居及 SRv6 前缀通告功能
 peer 3::3 enable
 peer 3::3 prefix-sid                                                             // 使能通告功能
  
7、绑定客户实例
 ipv4-family vpn-instance A                                               // 绑定客户实例
 peer 10.1.14.4 as-number 400                                         // 与 CE 建立 EBGP 邻居关系（用于 CE 与 PE 之间传递 IPv4 路由）
 segment-routing ipv6 locator LSW4                                // 客户 IPv4 路由（或站点）使用 LSW4 locator 标识
 segment-routing ipv6 best-effort                                    // 开启 SRv6 BE 功能，由 SRv6 BE 承载 CE 客户流量


查看命令：
① 查看站点标识
display segment-routing ipv6 local-sid end forwarding

② 查看连接段标识
display segment-routing ipv6 local-sid end-x forwarding 

③ 查看客户站点标识（标识客户站点，即：一个 IPv4 实例，根据该实例表项进行查表转发“类似于私网标签”）
display segment-routing ipv6 local-sid end-dt4 forwarding

```







## SRv6-policy 配置命令
```
一、基础配置
（所有的 NE 路由器都需要配置接口 IPv6 地址，并且配置 loopback0 接口）

1、所有设备关闭 DCN 实例
undo  dcn


2、配置 IS-IS 邻居
 isis 1                                                                                        // 创建 IS-IS 进程 1
 is-level level-2                                                                       // 设置设备等级（level-1 或 level-2 均可，推荐骨干网络采用 level-2）
 cost-style wide                                                                      // 设置宽度量支持
 network-entity 49.0001.0000.0000.0001.00                  // 配置 NET 地址
 ipv6 enable topology ipv6                                                  // 开启 MT 功能（使得 IS-IS 设备支持 IPv6 路径计算及转发）


3、配置 SRv6 locator 标识
 segment-routing ipv6                                                         // 开启 SRv6 支持
 encapsulation source-address 1::1                                  // 设置 SRv6 头部地址（1::1 即：loopback0 接口地址）
 locator 1 ipv6-prefix 3000:1:: static 32                          // 设置 locator 前缀标识（3000:1::/96 前缀标识，用于标识站点）static 标识为 32 位
                                                                            （locator + function 生成）不足 128 bit 使用 0 补充
opcode ::100 end  psp                                                                                                   // 手工补充站点 ID（end 代表本地站点）
opcode ::12:1 end-x interface Ethernet3/0/2 nexthop 3000:12::2 psp                            // 手工配置接口 ID（end-x 代表接口）          
opcode ::14:1 end-x interface Ethernet3/0/1 nexthop 3000:14::4 psp
opcode ::15 end-dt4 vpn-instance A                                                                                       // 指定实例 ID（如：ip vpn-instance）

 segment-list 1                                                                                                                             // 设置转发路径
 index 10 sid ipv6 3000:1::12:1
 index 20 sid ipv6 3000:2::23:2
 index 30 sid ipv6 3000:3::34:3
 srv6-te policy 1 endpoint 4::4 color 104                                                                                 // 指定 SRv6 policy 的目的地址及 color 
 candidate-path preference 100 
 segment-list 1                                                                                                                              // 调用路径


4、使能通告站点标识
 isis 1                                                                                                                       // 进入 IS-IS 进程 1
 segment-routing ipv6 locator 1    auto-sid-disable                                    // 通告 locator 1 标识（如：end、end-x 及 end-dt4）关闭自动生成


5、创建 vpn-instance 
（补充）
 tunnel-policy 1
 tunnel select-seq ipv6 srv6-te-policy load-balance-number 1

 ip vpn-instance A
 ipv4-family
 route-distinguisher 1:1
 vpn-target 100:100 export-extcommunity
 vpn-target 100:100 import-extcommunity                                                    // 用于区分客户地址空间
 tnl-policy 1                                                                                                           // 相比 SRv6 BE 配置，需要额外指定隧道策略

6、PE 设备建立 VPNv4 邻居
 bgp 100
 router-id 1.1.1.1                                                                                                // IPv6 地址无法自动生成 router-id（需要手工配置）
 peer 4::4 as-number 100
 peer 4::4 connect-interface LoopBack0                                                       // 使用 loopback0 接口地址建立 VPNv4 邻居（类似于 VPNv4-6PE）
 
 ipv4-family vpnv4                                                                                            // 进入 VPNv4 实例，使能邻居及 SRv6 前缀通告功能
 peer 4::4 enable
 peer 4::4 prefix-sid                                                                                         // 使能通告功能

  ipv4-family vpn-instance A
  segment-routing ipv6 locator 1                                                                  // 绑定 locator 1
  segment-routing ipv6 traffic-engineer best-effort                                 //  优先选择 SRv6 policy 当隧道故障则选用 BE 备份路径

  peer 10.1.15.5 as-number 500                                                                   // 与 CE 建立 BGP 邻居关系
  peer 10.1.15.5 route-policy color import                                                 // 调用 color 策略

 
 route-policy color permit node 10
 apply extcommunity color 0:401 

```
