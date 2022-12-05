export const data=[
    {
        "path": "/analysis",
        "component": "home",
        "redirect": "/analysis/safety",
        
        "meta": {
            "title": "平台数据分析",
            "icon": "Histogram",
            "hidden": false,
            "alwaysShow": true,
            "roles": [
                "admin"
            ],
            "keepAlive": true
        },
        "children": [
            {
                "path": "/analysis/safety",
                "component": "/analysis/safety",
                "name": "safety",
                'abbreviation':"平安聚合",
                "meta": {
                    "title": "平安聚合统计分析",
                   
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            },
            {
                "path": "/analysis/gps",
                "component": "/analysis/gps",
                "name": "gps",
                "meta": {
                    "title": "平安GPS上报统计",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            },
            {
                "path": "/analysis/safetytab",
                "component": "/analysis/safetytab",
                "name": "safetytab",
                "meta": {
                    "title": "平安专项数据统计",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            },
            {
                "path": "/analysis/service",
                "component": "/analysis/service",
                "name": "service",
                "meta": {
                    "title": "服务商时效统计分析",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            },
            {
                "path": "/analysis/invoice",
                "component": "/analysis/invoice",
                "name": "invoice",
                "meta": {
                    "title": "财务发票统计分析",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            },
            {
                "path": "/analysis/business",
                "component": "/analysis/business",
                "name": "business",
                "meta": {
                    "title": "财务业务统计分析",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            }
        ]
    },
    {
        "path": "/drivers",
        "component": "home",
        "redirect": "/drivers/driver",
        "name": "drivers",
        "meta": {
            "title": "虚拟司机管理",
            "icon": "Van",
            "hidden": false,
            "alwaysShow": true,
            "roles": [
                "admin"
            ],
            "keepAlive": true
        },
        "children": [
            {
                "path": "/drivers/driver",
                "component": "/drivers/driver",
                "name": "driver",
                "meta": {
                    "title": "虚拟司机列表",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            }
        ]
    },
    {
        "path": "/system",
        "component": "home",
        "redirect": "/system/menu",
        "name": "system",
        "meta": {
            "title": "系统配置",
            "icon": "Setting",
            "hidden": false,
            "alwaysShow": true,
            "roles": [
                "admin"
            ],
            "keepAlive": true
        },
        "children": [
            {
                "path": "/system/menu",
                "component": "/system/menu",
                "name": "menu",
                "meta": {
                    "title": "菜单管理",
                    "icon": "Histogram",
                    "hidden": false,
                    "alwaysShow": false,
                    "roles": [
                        "admin"
                    ],
                    "keepAlive": true
                }
            }
        ]
    }
]