import type { DefaultTheme } from 'vitepress'

export const sidebarMathCounting: DefaultTheme.Sidebar = {
  '/net/math-counting/': [
    {
      text: '数通复习',
      items: [
        { text: '网络基础', link: '/net/math-counting/files/网络基础' },
        { text: 'DHCP', link: '/net/math-counting/files/DHCP' },
        { text: 'DHCP 问题', link: '/net/math-counting/files/DHCP问题' },

        { text: 'IP编址', link: '/net/math-counting/files/IP编址' },

        { text: 'IP组播基础', link: '/net/math-counting/files/IP组播基础' },
        { text: 'IGMP', link: '/net/math-counting/files/IGMP' },
        { text: 'PIM', link: '/net/math-counting/files/PIM' },
        { text: '组播（汇总）', link: '/net/math-counting/files/组播' },

        { text: 'PPP', link: '/net/math-counting/files/PPP' },

        { text: 'OSPF基础', link: '/net/math-counting/files/OSPF基础' },
        { text: 'OSPF-LSA', link: '/net/math-counting/files/OSPF-LSA' },
        { text: 'ISIS', link: '/net/math-counting/files/ISIS' },

        { text: 'BFD', link: '/net/math-counting/files/BFD/BFD' },

        { text: '以太网交换基础', link: '/net/math-counting/files/以太网交换基础' },
        { text: '链路聚合', link: '/net/math-counting/files/链路聚合' },
        { text: '交换机堆叠/集群技术', link: '/net/math-counting/files/交换机堆叠_集群技术' },

        { text: 'MUX VLAN', link: '/net/math-counting/files/MUX_VLAN' },
        { text: 'Super VLAN', link: '/net/math-counting/files/vlan高级技术/Super Vlan' },
        { text: '隔离端口组', link: '/net/math-counting/files/vlan高级技术/隔离端口组' },
        { text: 'ARP 代理', link: '/net/math-counting/files/vlan高级技术/ARP_proxy' },

        { text: 'VRRP', link: '/net/math-counting/files/VRRP/VRRP' },

        { text: 'WLAN', link: '/net/math-counting/files/WLAN/WLAN' },

        { text: '以太网安全', link: '/net/math-counting/files/以太网安全/以太网安全' },

        { text: '防火墙基础', link: '/net/math-counting/files/防火墙/防火墙基础' },
        { text: '旁挂防火墙', link: '/net/math-counting/files/防火墙/旁挂防火墙' },

        { text: '题库：HCIA', link: '/net/math-counting/files/题库/HCIA题库' },
      ],
    },
    {
      text: '专题：BGP / MPLS / VPN / SR / IPv6',
      items: [
        { text: 'BGP', link: '/net/math-counting/files/BGP/BGP' },
        { text: 'BGP选路规则', link: '/net/math-counting/files/BGP/BGP选路规则' },

        { text: 'MPLS', link: '/net/math-counting/files/MPLS/MPLS' },
        { text: 'MPLS LDP', link: '/net/math-counting/files/MPLS/MPLS LDP' },
        { text: 'MPLS 路由迭代问题', link: '/net/math-counting/files/MPLS/MPLS 路由迭代问题' },

        { text: 'MPLS VPN', link: '/net/math-counting/files/MPLS_VPN/MPLS VPN' },
        { text: 'MPLSvpn应用场景', link: '/net/math-counting/files/MPLS_VPN/MPLSvpn应用场景' },

        { text: 'SR：Segment Routing 段路由', link: '/net/math-counting/files/SR/Segment Routing 段路由' },

        { text: 'IPv6', link: '/net/math-counting/files/IPv6/IPv6' },
        { text: 'IPv6 笔记', link: '/net/math-counting/files/IPv6/IPv6笔记' },
        { text: 'ICMPv6', link: '/net/math-counting/files/IPv6/ICMPv6' },
        { text: 'IPv6 路由协议', link: '/net/math-counting/files/IPv6/IPv6路由协议' },
      ],
    },
    {
      text: 'IE 笔记（部分）',
      items: [
        { text: 'IGP高级特性', link: '/net/math-counting/files/IE/IGP高级特性/IGP高级特性' },
        { text: 'BGP高级特性', link: '/net/math-counting/files/IE/BGP高级特性/BGP高级特性' },
        { text: 'BGP高级特性练习', link: '/net/math-counting/files/IE/BGP高级特性/BGP高级特性练习' },

        { text: 'QOS', link: '/net/math-counting/files/IE/QOS/QOS' },
        { text: 'VXLAN', link: '/net/math-counting/files/IE/VXLAN/VXLAN' },
        { text: 'EVPN', link: '/net/math-counting/files/IE/EVPN/evpn' },

        { text: '防火墙（IE）', link: '/net/math-counting/files/IE/防火墙/防火墙' },
        { text: '双机热备份', link: '/net/math-counting/files/IE/防火墙/双机热备份' },

        { text: 'IPv6 过渡技术', link: '/net/math-counting/files/IE/IPv6过渡技术/IPv6过渡技术' },
        { text: '6VPE', link: '/net/math-counting/files/IE/IPv6过渡技术/6VPE' },
        { text: 'NAT64', link: '/net/math-counting/files/IE/IPv6过渡技术/NAT64' },
        { text: 'IPv6 路由技术', link: '/net/math-counting/files/IE/IPv6路由技术/IPv6路由技术' },

        { text: 'MPLS_VPN跨域', link: '/net/math-counting/files/IE/MPLS_VPN跨域/MPLS_VPN跨域' },

        { text: 'SD-WAN', link: '/net/math-counting/files/IE/SD-WAN/SD-WAN' },
        { text: 'RESTful', link: '/net/math-counting/files/IE/RESTful/RESTful' },
        { text: 'ssh', link: '/net/math-counting/files/IE/ssh/ssh' },
        { text: 'SFTP', link: '/net/math-counting/files/IE/SFTP/SFTP' },
        { text: 'NETCONF', link: '/net/math-counting/files/IE/NETCONF/NETCONF' },

        { text: '网络运维：网络割接', link: '/net/math-counting/files/IE/网络运维/网络割接' },
        { text: '网络准入规则', link: '/net/math-counting/files/IE/网络准入规则/网络准入规则' },
        { text: '网络编程与自动化', link: '/net/math-counting/files/IE/网络编程与自动化/网络编程与自动化' },
      ],
    },
  ],
}