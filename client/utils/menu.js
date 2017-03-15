module.exports = [
  {
    key: 'dashboard',
    name: '仪表盘',
    icon: 'laptop'
  },
  {
    key: 'contentManage',
    name: '内容管理',
    icon: 'file-text',
    clickable: false,
    child: [
      {
        key: 'contentImgs',
        name: '图片资源'
      },
      {
        key: 'contentTypes',
        name: '文章分类'
      },
      {
        key: 'contents',
        name: '文章管理'
      }
    ]
  },
  {
    key: 'dest',
    name: '目的地',
    icon: 'environment',
    clickable: false,
    child: [
      {
        key: 'destination',
        name: '目的地管理'
      },
      {
        key: 'scenic',
        name: '景点'
      },
      {
        key: 'hotel',
        name: '酒店'
      },
      {
        key: 'restaurant',
        name: '餐厅'
      },
      /*{
        key: 'shopping',
        name: '商城'
      },*/
      {
        key: 'feature',
        name: '特定服务'
      },
      {
        key: 'other',
        name: '其他'
      }
    ]
  },
  {
    key: 'travel',
    name: '旅行计划',
    icon: 'rocket'
  }
]
