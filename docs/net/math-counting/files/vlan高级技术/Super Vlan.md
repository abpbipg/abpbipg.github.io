# Super VLAN
## 作用
```
    减少 VLAN 间的 IP地址消耗，实现多个 VLAN 共享同一个 VLANIF接口
```
## 角色
```
    1. 主VLAN（Super VLAN）
        - 必须是三层接口（VLANIF接口）
            - 不能包含二层接口
            （例如： vlanif 100 无法包含 vlan 100）
        - 主vlan 可以与 所有的 从vlan 实现互访
    
    2. 从VLAN（Sub vlan）
        - 必须是二层接口（vlan接口）
            - 不能包含三层接口
            （例如：vlan10，不能出现 vlanif10 接口）
        - 从vlan间（默认二层 和 三层均隔离，但可以访问 主vlanif接口）

补充：
    Sub vlan 缺省情况下
        - 不同vlan的用户 隔离，
        - 相同vlan的用户 能够实现互访
    
    如果希望 Sub vlan能够实现（MUX-vlan中的隔离型端口）可以配合隔离端口组使用
```
## 使用场景
```
    三层交换设备
        vlanif 接口为 网关接口（Super Vlan）
        不同部门的员工划分到相应的 Sub VLAN中
        （默认 vlan间隔离、vlan内可以互访）

        访客可以划分到 Sub vlan 中
        （如果访客间需要隔离，则访客端口单独配置隔离端口组）
```

## 配置命令
```
1、创建 VLAN
		vlan batch  10 20 30 100			// 如：10、20、30、100

	2、创建 Super vlan
		vlan 100					// vlan 100 为聚合 VLAN（即：Super VLAN）
 		aggregate-vlan
 		
        access-vlan 10 20 30				
        // vlan 10、20、30 为接入 VLAN（即：Sub VLAN）

	3、创建网关
		interface VLANIF 100
		
        ip address  10.1.1.254 24			
        // 例如：10.1.1.254/24（该接口为 VLAN 10、20、30 的三层网关）

	4、接入终端接口划入 VLAN
		interface G0/0/X				
        // 如：把 G0/0/X 接口划入 VLAN 10 中
 		
        port link-type access
 		port default vlan 10
	
	（扩展）默认情况下不同子 VLAN 的设备无法互访，二层隔离
	可以开启 VLAN 间的 ARP 代理功能实现，不同子 VLAN 的用户互访

		interface VLANIF 100
		
        arp-proxy inter-sub-vlan-proxy enable		
        // 进入 Super VLAN（开启 VLAN 间 ARP 代理，注意：inter 和 intra 不要选用错误）
```