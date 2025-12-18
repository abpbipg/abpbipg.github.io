import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: "起步",
    items: [  
      { text: "起步指南", link: "/start/" },
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
    text: "网络",
    items: [  
      { text: "缩写表", link: "/net/00-Abbreviation/" },
      { text: "数通", link: "/net/math-counting/" },
      { text: "HCIP思维导图", link: "/net/map/"},
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
      { text: "SQL学习笔记", link: "/serve/MYSQL/SQL学习笔记" },
    ],
  }, 
  
  {
    text: '健康常识',
    items: [
      { text: '健康首页（汇总）', link: '/healthy/' },

      { text: '体检与指标', link: '/healthy/体检-体检必备验血项目' },
      { text: '血常规解读（简单版）', link: '/healthy/血常规-血常规报告单解读-简单版' },
      { text: '血常规解读（详细版）', link: '/healthy/血常规-血常规报告单解读-详细版' },

      { text: '用药：如何正确吃药', link: '/healthy/常识-如何正确的吃药' },
      { text: '用药：家庭用药指南', link: '/healthy/常识-家庭用药指南' },

      { text: '疫苗：接种知识', link: '/healthy/疫苗-疫苗接种知识' },

      { text: '慢病科普：代谢综合征', link: '/healthy/科普-代谢综合征' },
      { text: '慢病科普：桥本甲状腺炎', link: '/healthy/科普-桥本甲状腺炎' },
      { text: '慢病科普：高尿酸血症', link: '/healthy/科普-慢性病-高尿酸血症' },

      { text: '癌症：人体癌症地图', link: '/healthy/癌症-人体癌症地图' },
      { text: '癌症：分期和分级', link: '/healthy/癌症-癌症分期和分级' },

      { text: '医保：基本医疗保险选择', link: '/healthy/常识-基本医疗保险选择' },
      { text: '医保：门诊慢性病种类', link: '/healthy/医保-门诊慢性病种类' },
    ],
  },

  {
    text: "数学",
    link: "https://math.note.yue.zone/",
  },
];  