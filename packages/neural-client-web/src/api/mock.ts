export const app = {
  "appNo": "207e7f97cb054cb3b58af9c1d60124e4",
  "appCode": "code",
  "appClass": 1,
  "aiModel": "gpt-4o",
  "assistantName": "智能体应用测试",
  "logoUrl": "https://res.ennew.com/image/png/d7cbf46490cdfa5b592f9c2b72ae8692.png",
  "botDefineDTO": {
    "define": "关于户内隐患的人设",
    "scenes": [
      {
        "name": "户内电线老化",
        "description": "在这个场景中，智能体需要检测户内电线是否老化，步骤包括：1. 使用专业设备检测电线的电阻和电流。2. 根据检测结果判断电线是否老化，如果电阻过高或电流过小，说明电线可能已经老化。"
      },
      {
        "name": "燃气泄漏",
        "description": "在这个场景中，智能体需要检测燃气是否泄漏，步骤包括：1. 使用燃气检测器检测室内的燃气浓度。2. 如果燃气浓度超过安全标准，立即关闭燃气源并通知相关人员。"
      },
      {
        "name": "安全隐患",
        "description": "在这个场景中，智能体需要监测户内是否存在安全隐患，步骤包括：热水器跟床在同一区域。"
      }
    ]
  },
  "botWelcomeDTO": {
    "type": "3",
    "content": "",
    "copyRight": "",
    "question": [
      "您能详细描述一下智能体应用测试_zql0606的主要功能和使用场景吗？15203891000168120332024-08-06${sys.question}",
      "在户内隐患场景中，这款应用如何帮助用户识别和处理隐患？t-GONGJIANBt-GONGJIANB207e7f97cb054cb3b58af9c1d60124e4136955997022198579414时03分00秒32",
      "您在使用智能体应用测试_zql0606时遇到过哪些问题，需要我们提供技术支持或改进的地方吗？"
    ],
    "card": [
      {
        "summary": true,
        "copilot": "false",
        "code": "neural-welcome-card",
        "recommendation": {
          "method": "1"
        },
        "remark": "",
        "type": "custom",
        "url": "https://s.ennew.com/npm/@enn/neural-welcome-card/0.0.3/index.min.js",
        "platforms": [
          "pc",
          "mobile"
        ],
        "args": [
          {
            "field": "name",
            "stream": false,
            "defaultValue": "",
            "name": "名称",
            "description": "",
            "source": "1",
            "type": "string",
            "value": "名称名称",
            "required": false
          },
          {
            "field": "content",
            "stream": false,
            "defaultValue": "",
            "name": "内容",
            "description": "",
            "source": "1",
            "type": "string",
            "value": "内容内容内容出参的字段content",
            "required": false
          }
        ],
        "appId": "207e7f97cb054cb3b58af9c1d60124e4",
        "name": "测试开场白的卡片",
        "id": 77137227267072,
        "welcome": true,
        "confirmConfig": {
          "needConfirm": false
        }
      }
    ],
    "top": false
  },
  "botAssetDTOS": [
    {
      "id": 195,
      "assetType": 2,
      "assetCode": "",
      "assetId": "1695",
      "assetName": "知识库测试zql0606",
      "assetDesc": "知识库测试zql0606在智能组装里使用新建"
    },
    {
      "id": 196,
      "assetType": 3,
      "assetCode": "execute_chain_test_zql",
      "assetId": "bpm_1717665338727_22601c",
      "assetName": "执行链测试zql",
      "assetDesc": "执行链测试zql执行链测试zql",
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "H5测试卡片0.01版本",
        "cardTemplateCode": "CARD_TEMPLATE_0fb5a3be824a4ac4a80c0935b62846b0",
        "cardPrompt": "",
        "cardArgs": [
          {
            "fieldCode": "title",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "主标题"
          },
          {
            "fieldCode": "thumbUrl",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1
          },
          {
            "fieldCode": "description",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1
          }
        ],
        "summary": false
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": false,
        "confirmTimeout": 0,
        "safeTimeout": 10
      },
      "recommendation": {
        "method": "2",
        "questions": [
          "执行链的推荐问题1"
        ]
      }
    },
    {
      "id": 197,
      "assetType": 1,
      "assetCode": "query_source_name",
      "assetId": "iop-executing-flow_service_666178cee4b0651f4a5f1bd7",
      "assetName": "查询源名称复制工程用户管网场景",
      "assetDesc": "复制工程用户管网场景",
      "request": [
        {
          "originalCode": "orgCode",
          "type": "string",
          "name": "组织编码",
          "code": "orgCode",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "businessType",
          "type": "string",
          "name": "业务类型",
          "code": "businessType",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "title",
          "type": "string",
          "name": "标题",
          "code": "title",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "card": {
        "bind": true,
        "custom": false,
        "type": "ai",
        "name": "智能图",
        "titleType": 2,
        "title": "图表标题自定义的标题名称智能图要长一点长一点要长一点长一点要长一点长一点要长一点长一点"
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": true,
        "tooltipText": "",
        "confirmTimeout": 35,
        "safeTimeout": 35
      },
      "recommendation": {
        "method": "1",
        "questions": []
      }
    },
    {
      "id": 204,
      "assetType": 1,
      "assetCode": "query_indoordanger_interface",
      "assetId": "iop-executing-flow_service_6662b5e9e4b0651f4a5f1be5",
      "assetName": "查询户内隐患编排接口",
      "assetDesc": "户内隐患编排接口",
      "request": [
        {
          "originalCode": "procDefKey",
          "type": "string",
          "name": "procDefKey",
          "code": "procDefKey",
          "desc": "取值gasmeter_20240118142201",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "correlationId",
          "type": "string",
          "name": "correlationId",
          "code": "correlationId",
          "desc": "154922qwer111",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "params",
          "type": "string",
          "name": "params",
          "code": "params",
          "desc": "{\n        \"url\": \"https://dobs-hw0003-xarq.obs.cn-north-4.myhuaweicloud.com:443/ai-oss-prod/-5850812630108315452.jpg\",\n        \"cameraIndexCode\": \"qwe123\",\n        \"usemotion\": \"1\",\n        \"projectId\": \" 292856\"\n    }",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "allDataFlag",
          "type": "string",
          "name": "allDataFlag",
          "code": "allDataFlag",
          "desc": "false",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "tenantId",
          "type": "string",
          "name": "tenantId",
          "code": "tenantId",
          "desc": "1369559970221985794",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "appId",
          "type": "string",
          "name": "appId",
          "code": "appId",
          "desc": "Construction_type_inspection",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "aiAccessSign",
          "type": "string",
          "name": "aiAccessSign",
          "code": "aiAccessSign",
          "desc": "eba43bab8d365b976aa864619844964d4cbbaef2471ded55a9c78e65c1365dc1\n",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "success",
          "type": "string",
          "name": "success",
          "code": "success",
          "desc": "是否成功",
          "required": false,
          "stream": false,
          "inContext": true
        },
        {
          "originalCode": "code",
          "type": "string",
          "name": "code",
          "code": "code",
          "desc": "0/200",
          "required": false,
          "stream": false,
          "inContext": true
        }
      ],
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "卡片模板",
        "cardTemplateCode": "CARD_TEMPLATE_022b021f1aed474c9b616aa6dc685ec5",
        "cardPrompt": "",
        "cardArgs": [
          {
            "fieldName": "Title",
            "fieldCode": "title",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 2,
            "dataValue": "success"
          },
          {
            "fieldName": "SubTitle",
            "fieldCode": "subTitle",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 2,
            "dataValue": "code"
          },
          {
            "fieldName": "Description",
            "fieldCode": "description",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "1112222"
          }
        ],
        "summary": false
      },
      "confirmConfig": {
        "needConfirm": true,
        "autoTooltip": true,
        "confirmTimeout": 35,
        "safeTimeout": 35
      },
      "recommendation": {
        "method": "2",
        "questions": [
          "户内隐患 的推荐问题${code}${success}"
        ]
      }
    },
    {
      "id": 207,
      "assetType": 2,
      "assetCode": "",
      "assetId": "1709",
      "assetName": "知识库0611"
    },
    {
      "id": 209,
      "assetType": 2,
      "assetCode": "",
      "assetId": "1711",
      "assetName": "知识库061102"
    },
    {
      "id": 388,
      "assetType": 1,
      "assetSubType": 2,
      "assetCode": "getUserPosition",
      "assetId": "iop-executing-flow_service_66865d76e4b034f02e44e6a4",
      "assetName": "查询用户位置",
      "assetDesc": "",
      "request": [
        {
          "originalCode": "userId",
          "type": "string",
          "name": "用户id",
          "code": "userId",
          "desc": "${sys.userId}",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "position",
          "type": "string",
          "name": "用户位置",
          "code": "position",
          "desc": "查询到的用户位置",
          "required": false,
          "stream": false,
          "inContext": true
        }
      ],
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "H5测试卡片0.01版本",
        "cardTemplateCode": "CARD_TEMPLATE_0fb5a3be824a4ac4a80c0935b62846b0",
        "cardPrompt": "卡片提示词",
        "cardArgs": [
          {
            "fieldCode": "title",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "主标题"
          },
          {
            "fieldCode": "thumbUrl",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "副标题"
          },
          {
            "fieldCode": "description",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "描述"
          }
        ],
        "summary": true
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": false,
        "confirmTimeout": 0,
        "safeTimeout": 10
      },
      "recommendation": {
        "method": "2",
        "questions": [
          "推荐的问题自定义问题1系统变量${sys.loginName}",
          "推荐的自定义问题2！！！！！${position}",
          "推荐问题3其他能力的出参引用${query_indoordanger_interface.errors}"
        ]
      }
    },
    {
      "id": 449,
      "assetType": 3,
      "assetCode": "electricity_payment",
      "assetId": "bpm_1720261309293_5c91fe",
      "assetName": "电费缴纳执行链",
      "assetDesc": "参数值必须从用户的问题中识别，识别不到就设置参数为空",
      "request": [
        {
          "originalCode": "houseId",
          "type": "string",
          "name": "房屋地址",
          "code": "houseId",
          "desc": "1",
          "required": true,
          "stream": false,
          "argDataSource": {
            "dropdown": true,
            "type": "service",
            "optionMap": {},
            "refBizId": "iop-executing-flow_service_66864eb4e4b034f02e44e69f",
            "inputMap": {
              "userID": "${sys.userId}"
            },
            "labelFieldPath": "data.outParamInfo.houses.name",
            "valueFieldPath": "data.outParamInfo.houses.id",
            "manual": true
          },
          "inContext": false
        },
        {
          "originalCode": "money",
          "type": "double",
          "name": "缴纳金额",
          "code": "money",
          "desc": "200",
          "required": true,
          "stream": false,
          "argDataSource": {
            "dropdown": false,
            "type": "custom",
            "optionMap": {},
            "inputMap": {},
            "manual": false
          },
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "result",
          "type": "string",
          "name": "缴纳结果",
          "code": "result",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": true
        }
      ],
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "测试卡片",
        "cardTemplateCode": "CARD_TEMPLATE_5798f22611ea4a4396faafb252bf0f3b",
        "copilotFlag": 0,
        "cardPrompt": "",
        "cardArgs": [],
        "summary": false
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": false,
        "confirmTimeout": 0,
        "safeTimeout": 10
      },
      "recommendation": {
        "method": "2",
        "questions": [
          "电费缴纳执行链问题1"
        ]
      }
    },
    {
      "id": 884,
      "assetType": 3,
      "assetCode": "query_user_house_execution_chain",
      "assetId": "bpm_1720432588121_b208ae",
      "assetName": "查询用户房屋的执行链",
      "assetDesc": "",
      "request": [
        {
          "originalCode": "userID",
          "type": "string",
          "name": "用户ID",
          "code": "userID",
          "desc": "",
          "required": true,
          "stream": false,
          "argDataSource": {
            "dropdown": false,
            "type": "custom",
            "optionMap": {},
            "inputMap": {},
            "manual": false
          },
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "houses",
          "type": "array",
          "name": "房屋信息",
          "code": "houses",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "123",
        "cardTemplateCode": "CARD_TEMPLATE_7c556f4968234291b7c359e96564fefb",
        "cardPrompt": "",
        "cardArgs": [
          {
            "fieldName": "title",
            "fieldCode": "title",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1
          },
          {
            "fieldName": "subTitle",
            "fieldCode": "subTitle",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1
          },
          {
            "fieldName": "description",
            "fieldCode": "description",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1
          },
          {
            "fieldCode": "actions",
            "fieldType": "array",
            "required": false,
            "stream": false,
            "dataOrigin": 1
          }
        ],
        "summary": false
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": false,
        "confirmTimeout": 0,
        "safeTimeout": 10
      },
      "recommendation": {
        "method": "1"
      }
    },
    {
      "id": 887,
      "assetType": 3,
      "assetCode": "location_recommend",
      "assetId": "bpm_1721634599948_d44321",
      "assetName": "大模型基于用户位置推荐景点",
      "assetDesc": "执行链关于内部服务流式的配置执行链关于内部服务流式的配置",
      "request": [
        {
          "originalCode": "position",
          "type": "string",
          "name": "用户位置",
          "code": "position",
          "desc": "上海",
          "required": true,
          "stream": false,
          "argDataSource": {
            "dropdown": false,
            "type": "custom",
            "optionMap": {},
            "inputMap": {},
            "manual": false
          },
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "name",
          "type": "string",
          "name": "name",
          "code": "name",
          "desc": "",
          "required": false,
          "stream": true,
          "inContext": false
        },
        {
          "originalCode": "reason",
          "type": "string",
          "name": "reason",
          "code": "reason",
          "desc": "",
          "required": false,
          "stream": true,
          "inContext": false
        },
        {
          "originalCode": "introduce",
          "type": "string",
          "name": "introduce",
          "code": "introduce",
          "desc": "",
          "required": false,
          "stream": true,
          "inContext": false
        }
      ],
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "简单场景卡片",
        "cardTemplateCode": "CARD_TEMPLATE_5b9e8c95f36d49f6ab1bac4c8e32d8cb",
        "cardPrompt": "",
        "cardArgs": [
          {
            "fieldName": "Title",
            "fieldCode": "title",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "主标题"
          },
          {
            "fieldName": "SubTitle",
            "fieldCode": "subTitle",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "副标题副标题副标题副标题副标题副标题副标题副标题副标题副标题"
          },
          {
            "fieldName": "Description",
            "fieldCode": "description",
            "fieldType": "string",
            "required": false,
            "stream": true,
            "dataOrigin": 1,
            "dataValue": "${reason}"
          }
        ],
        "summary": false
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": true,
        "tooltipText": "",
        "confirmTimeout": 35,
        "safeTimeout": 35
      },
      "recommendation": {
        "method": "1",
        "questions": []
      }
    },
    {
      "id": 890,
      "assetType": 3,
      "assetCode": "user_location_ad_year",
      "assetId": "bpm_1721639341660_46df99",
      "assetName": "用户所在位置的不同年份的广告",
      "assetDesc": "",
      "request": [
        {
          "originalCode": "city",
          "type": "string",
          "name": "城市",
          "code": "city",
          "desc": "北京",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "response": [
        {
          "originalCode": "adInvestment",
          "type": "array",
          "name": "不同年份广告投入",
          "code": "adInvestment",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "introduce",
          "type": "string",
          "name": "introduce",
          "code": "introduce",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        },
        {
          "originalCode": "reason",
          "type": "string",
          "name": "reason",
          "code": "reason",
          "desc": "",
          "required": false,
          "stream": false,
          "inContext": false
        }
      ],
      "card": {
        "bind": true,
        "cardType": 3,
        "custom": false,
        "name": "简单场景卡片",
        "cardTemplateCode": "CARD_TEMPLATE_5b9e8c95f36d49f6ab1bac4c8e32d8cb",
        "cardPrompt": "",
        "cardArgs": [
          {
            "fieldName": "Title",
            "fieldCode": "title",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "zhubiaoti "
          },
          {
            "fieldName": "SubTitle",
            "fieldCode": "subTitle",
            "fieldType": "string",
            "required": false,
            "stream": false,
            "dataOrigin": 1,
            "dataValue": "副标题"
          },
          {
            "fieldName": "Description",
            "fieldCode": "description",
            "fieldType": "string",
            "required": false,
            "stream": true,
            "dataOrigin": 2,
            "dataValue": "introduce"
          }
        ],
        "summary": false
      },
      "confirmConfig": {
        "needConfirm": false,
        "autoTooltip": false,
        "confirmTimeout": 0,
        "safeTimeout": 10
      },
      "recommendation": {
        "method": "1"
      }
    }
  ],
  "proposalType": 2,
  "proposalContent": "使用轻松诙谐的语气推荐4个问题；\n",
  "voiceFlag": 1,
  "voiceClass": "",
  "knowledgeSimilarity": 0.1,
  "chatStyle": "{\n  // 背景样式\n  \"background\": {\n    \"value\": \"#F3F6FF\"\n  },\n  // 用户气泡\n  \"userBubble\": {\n    // 背景色\n    \"backgroundValue\": \"linear-gradient(57deg, #32ACE6 0%, #4B7AFF 100%)\",\n    // 边框颜色\n    \"borderColor\": \"\",\n    // 边框宽度\n    \"borderWidth\": \"0px\",\n    // 字体颜色\n    \"fontColor\": \"#FFFFFF\"\n  },\n  // 机器人气泡\n  \"botBubble\": {\n    \"backgroundValue\": \"#ffffff\",\n    \"borderColor\": \"\",\n    \"borderWidth\": \"0px\",\n    \"fontColor\": \"#3D3E42\"\n  },\n  // 文字\n  \"font\": {\n    // 字体\n    \"family\": \"PingFangSC\",\n    // 字号\n    \"size\": \"14px\",\n    // 字重\n    \"weight\": \"normal\",\n    // 字体颜色\n    \"color\": \"#323233\",\n    // 行高\n    \"lineHeight\": \"22px\",\n    // 字间距\n    \"letterSpacing\": \"normal\"\n  }\n}",
  "answerSourceFlag": 1,
  "qaSimilarity": 0.99,
  "recallNum": 1,
  "showOriginal": true,
  "conversationNum": 5
}