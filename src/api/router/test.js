export const data = {
    "userInfo": {
        "id": 1,
        "name": "admin",
        "avatar": "https://sapi.chejj.cn/storage/NEF25nMpWS1fsBfMxVm5rK5cTdagJmue9f4qeJ4u.jpg",
        "mobile": "18658160522",
        "enable": 1,
        "admin_type": 1,
        "openid": "",
        "unionid": "",
        "app_id": null,
        "park_id": 0,
        "store_id": 0,
        "created_at": "2021-11-03 16:55:08",
        "updated_at": "1970-01-01 08:00:00",
        "deleted_at": null,
        "fullname": "周涛的",
        "nick_name": "橙色的天空",
        "sex": 1,
        "birthday": 499968000,
        "email": "283301717@163.com",
        "wechat": "18658160522",
        "qq": 283301717,
        "prifile": "年龄永远不是衡量一个人的刻度，只有责任的叠加才会让人逐渐成长。"
    },
    "menu": [
        {
            'path': '/analysis',
            'name': 'analysis',
            'component': "home",
            'redirect': 'safety',
            "meta": {
                "title": "平台数据分析",
                "icon": "my-icon-transverse",
                "short_name": "1",
            },
            'children': [
                {
                    'path': '/analysis/safety',
                    'name': 'safety',
                    'component': "/analysis/safety",
                    'meta': {
                        "title": "平安聚合统计分析",
                        "icon": "",
                        "short_name": "平安聚合",
                    }
                },
                {
                    'path': '/analysis/gps',
                    'name': 'gps',
                    'component': "/analysis/gps",
                    'meta': {
                        "title": "平安GPS上报统计",
                        "icon": "",
                        "short_name": "GPS上报",
                    }
                },
                {
                    'path': '/analysis/safetytab',
                    'name': 'safetytab',
                    'component': "/analysis/safetytab",
                    'meta': {
                        "title": "平安专项数据统计",
                        "icon": "",
                        "short_name": "专项数据",
                    }
                },
                {
                    'path': '/analysis/service',
                    'name': 'service',
                    'component': "/analysis/service",
                    'meta': {
                        "title": "服务商时效统计分析",
                        "icon": "",
                        "short_name": "服务商时效",
                    }
                },
               
                {
                    'path': '/analysis/invoice',
                    'name': 'invoice',
                    'component': "/analysis/invoice",
                    'meta': {
                        "title": "财务发票统计分析",
                        "icon": "",
                        "short_name": "财务发票",
                    }
                },
                {
                    'path': '/analysis/business',
                    'name': 'business',
                    'component': "/analysis/business",
                    'meta': {
                        "title": "财务业务统计分析",
                        "icon": "",
                        "short_name": "财务业务",
                    }
                },
              
            ]
        },
        {
            'path': '/drivers',
            'name': 'drivers',
            'component': "home",
            'redirect': 'driver',
            'meta': {
                "title": "虚拟司机管理",
                "icon": "my-icon-car",
               
            },
            'children': [
                {
                    'path': '/drivers/driver',
                    'name': 'driver',
                    'component': "/drivers/driver",
                    'meta': {
                        "title": "虚拟司机管理",
                        "icon": "my-icon-car",
                        "short_name": "虚拟司机",
                    },
                }
            ]
        }
        // {
        //     'path': '/show2',
        //     'name': 'show2',
        //     'component': "home",
        //     'redirect': '/show2/page21',
        //     "icon": "my-icon-home2",
        //     "meta": {
        //         "title": "导航二",
        //         "icon": "my-icon-home2",
        //         "short_name": "2",
        //     },
        //     'children': [
        //         {
        //             'path': '/show2/page21',
        //             'name': 'page21',
        //             'component': "/show2/page21",
        //             "icon": "my-icon-console",
        //             'meta':{
        //                 "title": "page21",
        //                 "icon": "my-icon-home2",
        //                 "short_name": "21",
        //             }
        //         },
        //         {
        //             'path': '/show2/page22',
        //             'name': 'page22',
        //             'component': "/show2/page22",
        //             "icon": "my-icon-console",
        //             'meta':{
        //                 "title": "page22",
        //                 "icon": "my-icon-home2",
        //                 "short_name": "22",
        //             }
        //         },
        //         {
        //             'path': '/show2/page23',
        //             'name': 'page23',
        //             'component': "/show2/page23",
        //             "icon": "my-icon-console",
        //             'meta':{
        //                 "title": "page23",
        //                 "icon": "my-icon-home2",
        //                 "short_name": "23",
        //             }
        //         }
        //     ]
        // },
        // { 
        //     'path': '/show3',
        //     'name': 'show3',
        //     'component': "home",
        //     'redirect': '/show3/page31',
        //     "icon": "my-icon-home2",
        //     "meta": {
        //         "title": "导航一",
        //         "icon": "my-icon-home2",
        //         "short_name": "1",
        //     },
        //     'children': [
        //         {
        //             'path': '/show3/page31',
        //             'name': 'page31',
        //             'component': "/show3/page31",
        //             "icon": "my-icon-console",
        //             'meta':{
        //                 "title": "导航三",
        //                 "icon": "my-icon-home2",
        //                 "short_name": "31",
        //             }
        //         },

        //     ]
        // },
        // {
        //     'path': '/show4',
        //     'name': 'show4',
        //     'component': "home",
        //     'redirect': '/show4/page41',
        //     "icon": "my-icon-home2",
        //     "meta": {
        //         "title": "导航四",
        //         "icon": "my-icon-home2",
        //         "short_name": "1",
        //     },
        //     'children': [
        //         {
        //             'path': '/show4/page41',
        //             'name': 'page41',
        //             'component': "/show4/page41",
        //             "icon": "my-icon-console",
        //             'meta':{
        //                 "title": "page41",
        //                 "icon": "my-icon-home2",
        //                 "short_name": "41",
        //             }
        //         },
        //         {
        //             'path': '/show4/page42',
        //             'name': 'page42',
        //             'component': "/show4/page42",
        //             "icon": "my-icon-console",
        //             'redirect': '/show4/page42/view421',
        //             'children': [
        //                 {
        //                     'path': '/show4/page42/view421',
        //                     'name': 'view421',
        //                     'component': "/show4/page42/view421",
        //                     "icon": "my-icon-console",
        //                     'meta':{
        //                         "title": "view421",
        //                         "icon": "my-icon-home2",
        //                         "short_name": "421",
        //                     }
        //                 },
        //                 {
        //                     'path': '/show4/page42/view422',
        //                     'name': 'view422',
        //                     'component': "/show4/page42/view422",
        //                     "icon": "my-icon-console",

        //                     'meta':{
        //                         "title": "view422",
        //                         "icon": "my-icon-home2",
        //                         "short_name": "422",
        //                     }
        //                 }

        //             ],
        //             'meta':{
        //                 "title": "page42",
        //                 "icon": "my-icon-home2",
        //                 "short_name": "42",
        //             }
        //         }

        //     ]
        // },
    ]
}


