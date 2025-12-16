# VRRP（虚拟路由冗余协议）
  - 作用：
    - 实现网关的冗余（备份、负载）；
  - 原理：
    - 把一台路由器虚拟为多台虚拟路由器（根据vrid区分），在多台路由器上创建相同的VRID组，配置相同的虚拟ip，
    - 并且把该虚拟ip作为终端设备的网关使用，即可实现网关冗余；
  - 架构：主备
```
   = 主：master，作为主网关使用；
       
        master设备会周期性从网关接口发送vrrp报文（1s/次），用于维护自身的主地位；
        如果backup设备在超时时间内（3s）无法收到master的vrrp报文，则切换为主；
   
   = 备：
        backup，作为主网关的备份，当master故障后，backup会切换为master；

  = 主备选举规则：
   1、比较vrrp优先级，越大越优（默认为100）
   2、比较物理接口ip地址，越大越优；
```
```
  配置：
   interface GigabitEthernet0/0/1               //进入网关接口进行配置
     ip address 192.168.1.254 24                //配置物理ip 

     vrrp vrid 10 virtual-ip 192.168.1.252      //创建vrid组10，指定虚拟ip为192.168.1.252（建议虚拟ip不要跟物理ip冲突）

     vrrp vrid 10 priority 120                 //修改优先级为120，优先级范围为0~255，其中0与255无法调整，有特殊用途；
        0：用于master退组，当master需要退出vrid组时（如删除配置时），会发送优先级为0的vrrp报文出去，backup设备收到后，切换为master；
        255：代表设备为虚拟ip的拥有者，当一台路由器配置的物理接口ip与虚拟ip相同时，优先级为置为255，一定为master；

     vrrp vrid 10 preempt-mode timer delay 3   //设置抢占延时为3s，默认立即抢占；
     vrrp vrid 10 timer advertise 2            //修改vrrp报文发送周期为2s；
     vrrp vrid 10 authentication-mode md5 huawei   //配置认证，密码为huawei，只有双方认证通过，主备关系才能建立；

     //联动命令：当接口G0/0/1故障或者bfd会话1失效，设备都会降低优先级30，实现主备切换；
     vrrp vrid 10 track interface GigabitEthernet0/0/1 reduced 30
     vrrp vrid 10 track bfd-session session-name 1 reduced 30
```

## VRRP实现负载：
   - 原理：多台路由器上创建多个相同的vrid组，并且设置为互为主备；
```
   配置：
    R1：作为vrid组10的backup以及vrid组20的master；
     interface GigabitEthernet0/0/1
      ip address 192.168.1.254 24
      vrrp vrid 10 virtual-ip 192.168.1.252
      vrrp vrid 20 virtual-ip 192.168.1.251
      vrrp vrid 20 priority 120

    R4：作为vrid组20的backup以及vrid组10的master；
     interface GigabitEthernet0/0/1
      ip address 192.168.1.253 24
      vrrp vrid 10 virtual-ip 192.168.1.252
      vrrp vrid 10 priority 120
      vrrp vrid 20 virtual-ip 192.168.1.251



   display vrrp brief          //查看vrrp的基本信息；
```