import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  "/start/": [
    {
      text: "起步",
      items: [
        { text: "起步指南", link: "/start/start" },
        { text: "使用 VScode", link: "/start/use_VScode/" },
        { text: "使用 IDEA", link: "/start/use_IDEA/" },
        { text: "Markdown", link: "/start/markdown" },
        { text: "Mermaid", link: "/start/mermaid" },
        { text: "YAML", link: "/start/yaml" },
      ],
    },
  ],
  
  "/coding/Spring/Framework/WebServlet/": [
    {
      text: "Spring Web Servlet",
      items: [
        { text: "Spring Web MVC", link: "/coding/Spring/Framework/WebServlet/1.SpringWebMVC" },
        { text: "REST Clients", link: "/coding/Spring/Framework/WebServlet/2.REST_Clients" },
        { text: "Testing", link: "/coding/Spring/Framework/WebServlet/3.Testing" },
        { text: "WebSockets", link: "/coding/Spring/Framework/WebServlet/4.WebSockets" },
        { text: "Other Web Frameworks", link: "/coding/Spring/Framework/WebServlet/5.OtherWebFrameworks" },
      ],
    },
  ],
  
  "/coding/Java/Gradle/": [
    {
      text: "Gradle",
      items: [
        { text: "Gradle 介绍", link: "/coding/Java/Gradle/" },
      ],
    },
  ],
  
  "/coding/": [
    {
      text: "编程",
      items: [
        { text: "Web 开发", link: "/coding/Web/" },
        { text: "Java", link: "/coding/Java/" },
        { text: "Spring", link: "/coding/Spring/" },
        { text: "Python", link: "/coding/Python/" },
        { text: "MariaDB", link: "/coding/MariaDB/" },
        { text: "Redis", link: "/coding/Redis/" },
        { text: "RabbitMQ", link: "/coding/RabbitMQ/" },
        { text: "Docker", link: "/coding/Docker/" },
      ],
    },
  ],
  
  "/net/": [
    {
      text: "网络工程师",
      items: [
        { text: "缩写表", link: "/net/00-Abbreviation/" },
        { text: "ENSP实验", link: "/net/ensp/" },
        { text: "思维导图", link: "/net/map/"},
        { text: "丢分题", link:"/net/lost/"},
        { text: "MPLS", link:"/net/mpls/"},
      ],
    },
  ],
  
  "/serve/base/": [
    {
      text: "基本操作",
      items: [
        { text: "系统安装", link: "/serve/base/sys_install/" },
        { text: "系统配置", link: "/serve/base/sys_config/" },
      ],
    },
  ],
  
  "/serve/VM/": [
    {
      text: "云平台与虚拟机",
      items: [
        { text: "DCC-CRL1000", link: "/serve/VM/DCC-CRL1000/" },
        { text: "VMware", link: "/serve/VM/VMware/" },
        { text: "VirtualBox", link: "/serve/VM/VirtualBox/" },
        { text: "Hyper-V", link: "/serve/VM/Hyper-V/" },
      ],
    },
  ],
  
  "/serve/WS/": [
    {
      text: "Windows Server",
      items: [
        { text: "AD-DS", link: "/serve/WS/AD-DS/" },
        { text: "AD-CS", link: "/serve/WS/AD-CS/" },
        { text: "AD-RMS", link: "/serve/WS/AD-RMS/" },
        { text: "DNS", link: "/serve/WS/DNS/" },
        { text: "IIS", link: "/serve/WS/IIS/" },
        { text: "DHCP", link: "/serve/WS/DHCP" },
        { text: "WDS", link: "/serve/WS/WDS/" },
        { text: "FS", link: "/serve/WS/FS/" },
        { text: "iSCSI", link: "/serve/WS/iSCSI/" },
        { text: "DFS", link: "/serve/WS/DFS/" },
        { text: "NLB", link: "/serve/WS/NLB/" },
        { text: "故障转移集群", link: "/serve/WS/FailoverCluster/" },
        { text: "PS", link: "/serve/WS/PS/" },
        { text: "通用要求", link: "/serve/WS/CommonRequirements/" },
      ],
    },
  ],
  
  "/serve/CentOS/E-Mail/": [
    {
      text: "E-Mail",
      items: [
        { text: "Postfix", link: "/serve/CentOS/E-Mail/Postfix" },
        { text: "Dovecot", link: "/serve/CentOS/E-Mail/Dovecot" },
      ],
    },
  ],
  
  "/serve/CentOS/": [
    {
      text: "CentOS",
      items: [
        { text: "基础", link: "/serve/CentOS/Base/" },
        { text: "firewalld", link: "/serve/CentOS/firewalld/" },
        { text: "Unbound", link: "/serve/CentOS/Unbound/" },
        { text: "CA", link: "/serve/CentOS/CA/" },
        { text: "Chrony", link: "/serve/CentOS/Chrony/" },
        { text: "NFS", link: "/serve/CentOS/NFS/" },
        { text: "MariaDB", link: "/serve/CentOS/MariaDB/" },
        { text: "Apache", link: "/serve/CentOS/Apache/" },
        { text: "Tomcat", link: "/serve/CentOS/Tomcat/" },
        { text: "Samba", link: "/serve/CentOS/Samba/" },
        { text: "NIS", link: "/serve/CentOS/NIS/" },
        { text: "E-Mail", link: "/serve/CentOS/E-Mail/" },
        { text: "Pacemaker", link: "/serve/CentOS/Pacemaker/" },
      ],
    },
  ],
  
  "/serve/Ubuntu/": [
    {
      text: "Ubuntu",
      items: [
        { text: "Ubuntu 介绍", link: "/serve/Ubuntu/" },
      ],
    },
  ],
};