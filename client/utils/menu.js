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
        key: 'envList',
        name: '目的地管理'
      },
      {
        key: 'envLand',
        name: '景点'
      },
      {
        key: 'envFB',
        name: '餐厅'
      },
      {
        key: 'envHotel',
        name: '酒店'
      },
      {
        key: 'envShop',
        name: '商城'
      },
      {
        key: 'envFeature',
        name: '特色服务'
      },
      {
        key: 'envOther',
        name: '其他'
      }
    ]
  },
  {
    key: 'plan',
    name: '旅行计划',
    icon: 'rocket'
  }
]
