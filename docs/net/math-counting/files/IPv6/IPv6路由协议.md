## 静态路由协议
```
	配置方式与 IPv4 类似
	ipv6 route-static 2::2 128 2000::2 			// 目的地址为：2::2/128 的路由，下一跳为：2000::2

	格式：ipv6 route-static + 目的地址 + 前缀长度 + 下一跳地址 
```

## 动态路由协议
### OSPFv3
```
	相比于 OSPFv2，删除了头部中的认证字段，修改为 instance 字段
	作用：
        一个接口可以宣告到不同的 OSPFv3 进程和 instance 中（实现链路的多复用）“OSPFv2 一个接口只能宣告到一个进程中”

	OSPFv3 的 1、2类 LSA 不再携带路由信息，
        仅携带拓扑信息（实现 PRC 计算，路由变化不再影响节点计算 “OSPFv2 使用 I-SPF 计算”）
	    
        1、2 类的路由信息，
            通过 intra-area-prefix LSA 携带（9 类LSA）区域内传递
	    
        接口的链路本地地址（link-local 信息）
            通过 link LSA 携带（8 类LSA）仅在链路上传递，每个接口都会产生

配置命令：
	1、创建 OSPFv3 进程
		ospfv3 1

	2、配置 Router id
		router-id X.X.X.X			// 依然使用点分十进制（IPv4 地址格式显示）
		
	3、发布接口
		interface G0/0/X
		ospfv3 1 area 0.0.0.0  instance 0	// 把 G0/0/X 发布到 OSPFv3 进程 1 区域 0 中，且实例为 0
	（相同区域 ID 和实例 ID 的互联设备才能建立邻居和邻接关系）	

	查看邻居关系
	display ospfv3 peer
```


### IS-IS
```
	IS-IS 无需修改版本，仅需要添加新的 TLV 即可支持 IPv6 路由
	（229、232、235、237）分别携带 IPv4 和 IPv6 的拓扑信息和路由信息
	
配置命令
	isis 1							// 进入 IS-IS 进程 1
 	network-entity 49.0001.0000.0000.0001.00		// 配置 net 地址（由区域 ID + 系统 ID + 特殊标识符组成）
 	ipv6 enable topology ipv6				// 开启 IPv6 拓扑支持（MT）

	接口发布
	interface G0/0/X
	isis ipv6 enable 1					// 把 G0/0/X 接口发布到 IS-IS 进程 1 中

	查看邻居
	display isis peer
```	


### BGP4+
```
	通过新增的 MP-REACH-NLRI 来携带 IPv6 路由信息
	通过新增的 MP-UNREACH-NLRI 来撤销不可达的 IPv6 路由信息
	无需更换版本，只需扩展协议族即可

配置命令
	bgp 100							// 进入 BGP ，AS 号为：100
 	router-id 1.1.1.1					// 设置 router id（必须手工配置）
 	peer 2::2 as-number 100 				// 指定邻居			
 	peer 2::2 connect-interface LoopBack0			// 使用 loopback0 接口与 2::2 建立 IBGP 邻居关系

 	ipv6-family unicast					// 进入 IPv6 地址簇，单播
  	peer 2::2 enable					// 使能 2::2 邻居关系

  	peer 2::2 route-policy AS export			// 如果需要调用路由策略，则需要进入 IPv6 单播地址簇中调用（参考 IPv4 修改属性）

	查看邻居关系
	display bgp ipv6 peer					// 查看 IPv6 的 BGP 邻居
```
