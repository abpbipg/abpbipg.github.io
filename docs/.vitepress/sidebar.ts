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
      text: "网络",
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

  '/healthy/': [
    {
      text: '健康',
      collapsed: false,
      items: [{ text: '首页（汇总）', link: '/healthy/' }],
    },

    {
      text: '健康生活常识',
      collapsed: false,
      items: [
        { text: '不同肥胖评估指标及测量方法', link: '/healthy/常识-不同肥胖评估指标及测量方法' },
        { text: '如何减肥', link: '/healthy/常识-如何减肥' },
        { text: '三高的危害', link: '/healthy/常识-三高的危害' },
        { text: '如何正确喝水', link: '/healthy/常识-如何正确喝水' },
        { text: '为什么要戒掉麸质', link: '/healthy/常识-为什么要戒掉麸质' },
        { text: '如何通过改善饮食抵抗慢性炎症', link: '/healthy/常识-如何通过改善饮食抵抗慢性炎症' },
        { text: '身体问题与心理的关系', link: '/healthy/常识-身体问题与心理的关系' },
        { text: '健康管理常识合集', link: '/healthy/常识-健康管理常识合集' },
        { text: '十二个炎症指标', link: '/healthy/常识-十二个炎症指标' },
        { text: '心血管堵塞', link: '/healthy/常识-心血管堵塞' },
        { text: '什么情况下需要点滴', link: '/healthy/常识-什么情况下需要点滴' },
        { text: '癌症预防', link: '/healthy/常识-癌症-预防癌症' },
        { text: '5类健康食物堪比天然止痛药', link: '/healthy/常识-科普-5类健康食物堪比天然止痛药' },
        { text: '痤疮痘痘的类型及治疗', link: '/healthy/常识-痤疮痘痘的类型及治疗' },
        { text: '基本医疗保险选择', link: '/healthy/常识-基本医疗保险选择' },
      ],
    },

    {
      text: '体检与化验',
      collapsed: false,
      items: [
        { text: '体检必备验血项目', link: '/healthy/体检-体检必备验血项目' },
        { text: '14项常见身体异常指标解读', link: '/healthy/体检-14项常见身体异常指标解读' },
        { text: '50项实用医学指标', link: '/healthy/体检-50项实用医学指标' },

        { text: '血检：常见十种血检', link: '/healthy/血检-常见十种血检' },
        { text: '血检：血脂四项检查', link: '/healthy/血检-血脂四项检查' },
        { text: '血检：凝血六项检查', link: '/healthy/血检-凝血六项检查' },
        { text: '血检：生化全套', link: '/healthy/血检-生化全套' },

        { text: '肿瘤标记物', link: '/healthy/血检-肿瘤标记物' },
        { text: '肿瘤标记物（CA-125）', link: '/healthy/血检-肿瘤标记物-CA125' },
        { text: '癌症血液检查', link: '/healthy/血检-癌症血液检查' },

        { text: '血常规解读（简单版）', link: '/healthy/血常规-血常规报告单解读-简单版' },
        { text: '血常规解读（详细版）', link: '/healthy/血常规-血常规报告单解读-详细版' },
      ],
    },

    {
      text: '用药与药品',
      collapsed: false,
      items: [
        { text: '如何正确的吃药', link: '/healthy/常识-如何正确的吃药' },
        { text: '家庭用药指南', link: '/healthy/常识-家庭用药指南' },

        { text: '常用实惠药清单', link: '/healthy/药品-常用实惠药清单' },
        { text: '维生素的补充', link: '/healthy/药品-维生素的补充' },
        { text: '眼药水', link: '/healthy/药品-眼药水' },
        { text: '皮肤科外用药', link: '/healthy/药品-皮肤科外用药' },
        { text: '5个不伤肾的降高血压药物', link: '/healthy/药品-5个不伤肾的降高血压药物' },
        { text: '三种常见的救急药', link: '/healthy/药品-三种常见的救急药' },
        { text: '抗生素及常见3种抗生素', link: '/healthy/药品-抗生素及临床各科室常见3种抗生素' },
        { text: '口服抗生素（科普）', link: '/healthy/科普-口服抗生素' },

        { text: '14种抗衰老及长寿补充剂', link: '/healthy/药品-14种抗衰老以及长寿的最佳补充剂' },
        { text: '原研药信息展示', link: '/healthy/药品-原研药信息展示' },
        { text: '2024年版超药品说明书用药目录', link: '/healthy/药品-2024年版超药品说明书用药目录' },
      ],
    },

    {
      text: '疫苗',
      collapsed: false,
      items: [{ text: '疫苗接种知识', link: '/healthy/疫苗-疫苗接种知识' }],
    },

    {
      text: '慢病与科普',
      collapsed: false,
      items: [
        { text: '代谢综合征', link: '/healthy/科普-代谢综合征' },
        { text: '桥本甲状腺炎', link: '/healthy/科普-桥本甲状腺炎' },
        { text: '桥本甲状腺炎伴甲减饮食建议', link: '/healthy/科普-桥本甲状腺炎伴甲减饮食生活建议' },
        { text: '高尿酸血症', link: '/healthy/科普-慢性病-高尿酸血症' },
        { text: '糖尿病', link: '/healthy/科普-糖尿病' },
        { text: '糖化血红蛋白', link: '/healthy/科普-糖尿病检测-糖化血红蛋白' },
        { text: '乳腺结节处理策略', link: '/healthy/科普-乳腺结节的处理策略' },
        { text: '卵巢癌 ROMA 指数', link: '/healthy/科普-卵巢癌ROMA指数' },
        { text: '胰岛素抵抗：治疗', link: '/healthy/胰岛素抵抗-胰岛素抵抗及治疗' },
      ],
    },

    {
      text: '检查 / 手术 / 术后',
      collapsed: false,
      items: [
        { text: '妇科常见检查', link: '/healthy/检查-妇科常见检查' },
        { text: '宫腔镜', link: '/healthy/检查-宫腔镜' },
        { text: '腹部B超到底能不能喝水', link: '/healthy/检查-腹部B超到底能不能喝水' },
        { text: '术后剪线与拆线', link: '/healthy/手术-术后-剪线与拆线' },
        { text: '一般术后出院注意事项', link: '/healthy/一般术后出院注意事项' },
      ],
    },

    {
      text: '癌症',
      collapsed: false,
      items: [
        { text: '人体癌症地图', link: '/healthy/癌症-人体癌症地图' },
        { text: '癌症分期和分级', link: '/healthy/癌症-癌症分期和分级' },
      ],
    },

    {
      text: '医保',
      collapsed: false,
      items: [{ text: '门诊慢性病种类', link: '/healthy/医保-门诊慢性病种类' }],
    },
  ],
}