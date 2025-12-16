# ARP proxy
## 1、路由式的 ARP 代理
```
	当 PC 被路由器隔离，但 PC 属于相同网段时，可以进入路由器接口开启路由式的 ARP 代理

	如：PC1——AR1——PC2		
        // PC1 地址：10.1.1.1/16、网关：10.1.1.254
		// PC2 地址：10.1.2.2/16、网关：10.1.2.254

		// AR1 连接 PC1 的接口地址：10.1.1.254/24、
               连接 PC2 的接口地址：10.1.2.254/24

	以上场景：
        PC1 无法直接使用 ARP 请求获取 PC2 的 MAC 地址
        （路由器默认隔离广播域，ARP 仅能在同一个广播域中传递）
	
        可以进入 AR1 的接口开启该命令：  
            arp-proxy enable	（开启后 AR1 设备代理对方 PC 响应 ARP 请求）
```

## 2、VLAN 间的 ARP 代理
```
	缺省情况下
        使用 Super VLAN 后，子 VLAN 的 PC 无法实现互访
	
        需要进入 Super VLAN 接口，
        开启 VLAN 间的 ARP 代理（参考 Super VLAN 扩展命令）
```

## 3、VLAN 内的 ARP 代理
```
缺省情况下：被划分到相同端口组的设备无法互访
	
如：PC1 地址：10.1.1.1/24、PC2 地址：10.1.1.2/24，处于相同 VLAN 10
	
    PC1、PC2 连接到交换机的端口都为 port-isolate enable group 1，
    PC1 与 PC2 则无法互访

	进入 VLANIF 10 接口开启以下命令
	    interface VLANIF 10
	    arp-proxy inter-sub-vlan-proxy enable			
        // 开启后可以实现 PC1 与 PC2 的互访，二层隔离三层互访

补充：
    如果是三层隔离模式，则以上命令也无法实现 PC1 与 PC2 互访
```