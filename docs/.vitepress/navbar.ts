import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: "起步",
    items: [  
      { text: "起步指南", link: "/start/start.md" },
      { text: "使用 VScode", link: "/start/use_VScode/" },
      { text: "使用 IDEA", link: "/start/use_IDEA/" },
      { text: "Markdown", link: "/start/markdown.md" },
      { text: "Mermaid", link: "/start/mermaid.md" },
      { text: "YAML", link: "/start/yaml.md" },
    ],
  },
  {
    text: "编程",
    items: [  
      { text: "Web 开发", link: "/coding/Web/" },
      { text: "WS/PS", link: "/serve/WS/PS/" },
      { text: "Python", link: "/coding/Python/" },
      { text: "Java", link: "/coding/Java/" },
      { text: "Spring", link: "/coding/Spring/" },
      { text: "MariaDB", link: "/coding/MariaDB/" },
      { text: "PostgreSQL", link: "https://jvtc.yue.zone/docs/开发/环境/PostgreSQL/" },
      { text: "Redis", link: "/coding/Redis/" },
      { text: "RabbitMQ", link: "/coding/RabbitMQ/" },
      { text: "Docker", link: "/coding/Docker/" },
    ],
  },
  {
    text: "网络工程师(重写中...)",
    items: [  
      { text: "缩写表", link: "/net/00-Abbreviation/" },
      { text: "ENSP实验", link: "/net/ensp/"},
      { text: "思维导图", link: "/net/map/"},
      { text: "丢分题", link:"/net/lost/"},
      { text: "MPLS", link:"/net/mpls/"},


    ],
  },	
  {
    text: "系统服务",
    items: [  
      { text: "基础", link: "/serve/base/" },
      { text: "虚拟机", link: "/serve/VM/" },
      { text: "WS", link: "/serve/WS/" },
      { text: "CentOS", link: "/serve/CentOS/" },
      { text: "Ubuntu", link: "/serve/Ubuntu/" },
    ],
  }, 
  {
    text: "数学",
    link: "https://math.note.yue.zone/",
  },
];  