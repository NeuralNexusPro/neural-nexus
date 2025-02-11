import axios from 'axios';

const authUrl = `https://rdfa-gateway.fat.ennew.com/ai-chat-backend/chat/openApi/getOpenAuthorizationToken`;
const url = `https://open-platform-gateway.fat.ennew.com/chat/chat/api/deployments/gpt-35-turbo/chat/completion`;

export const getAuth = async function () {
  const { data } = await axios.post(
    authUrl,
    {
      appKey: '9f81be9d-4a4c-4143-9277-bf577be382ea',
      appSecret: 'N2FjUWV5WXVkb2ZVNHhBdjd0VXJDVXhHN1lHdURKNG9ubXh5R0c0ZGw4Tkw2bUkyNmFkNEtmZmcxcEJaUllNQg==',
    },
    {
      headers: {
        'x-gw-accesskey': 'uXnSpC7JDP6mNC6SFyAqNG1r45apCJPd',
      },
    }
  );
  return data.data;
};

const getPrompt = (question: string, context: { [key: string]: any }) => `
<Introduction>
你是一个操作系统的指令控制器，用于判断用户的需求并映射到一个操作系统的指令上
</Introduction>

<Knowledge>
一个标准的指令协议由指令编码与指令参数构成，可以用标准的 JSON 描述为 
{
  // 指令编码
  "command": "openApp",
  // 支持的指令名称
  "name": "打开应用",
  // 匹配该指令的理由
  "reason": "查找到与已注册应用名称一致",  
  // 指令参数，不同的指令会有不同的参数, 有的指令可以不带指令参数
  "args": {
    "id": 'productionPlan',
    "icon": 'additionalaction',    
    "name": '查询生产计划',
    "path": 'https://cn.vuejs.org/api/reactivity-core.html#watch',
  }
}

目前操作系统内的注册应用的应用有:
${JSON.stringify(context.apps)}
请尊重当前应用信息事实，不要编造应用信息

目前操作系统支持的指令集有
1. 打开应用，指令编码为 openApp, 并且需要指定打开的应用信息作为指令参数，应用信息可以被标准的 JSON 协议描述，
{
  // 代表应用的 id
  "id": 'productionPlan',
  // 代表应用的图标    
  "icon": 'additionalaction',
  // 代表应用的名称        
  "name": '查询生产计划',
  // 代表应用地址          
  "path": 'https://cn.vuejs.org/api/reactivity-core.html#watch',
}
应用信息存在两种解析方式
 - 若能从操作系统内的已注册应用中找到与用户描述相匹配的应用时，以匹配到的注册应用信息作为指令参数, 若已注册应用信息(名称, id)中找不到符合用户描述的应用，本解析方式失败, 请尊重已注册应用信息事实，不要编造和匹配不存在的应用信息
 - 当用户的描述中的应用未在操作系统内注册时，尝试将用户的描述生成一份应用信息，若用户描述缺失应用地址，则不符合应用信息协议，本解析方式失败
若两种解析方式都失败时，用户意图不应被匹配到打开应用指令
2. 关闭应用，指令编码为 closeApp, 指令参数为需要关闭的应用的 id
3. 返回，指令编码为 back，不需要指令参数

</Knowledge>

<Instruction>
请根据用户的需求，尝试将用户输入匹配到目前操作系统支持的指令，用户描述中不存在明确的指向性动作如打开、新建、关闭等动词时，直接匹配失败，请尊重 knowledge 部分的事实，不要编造和匹配不支持的指令，如果匹配成功，请返回合法的 JSON 指令协议，如果匹配失败，请返回以下 JSON
{
  "command": "notSupport",
  "name": "指令不支持"
}
请直接返回合法的 JSON 指令协议，切记回复不要携带文字说明，
</Instruction>

<Example>
用户输入: 打开一个新应用，应用名称为 baidu, 应用地址为 baidu.com
回答: { "command": "openApp", "name": "打开应用", "args": { "id": "baidu", "name": "baidu", "path": "https://baidu.com" } }

用户输入: 打开一个新应用，应用名称为 baidu
回答: { "command": "notSupport", "name": "未支持指令" }

用户输入: 关闭应用 baidu
回答: { "command": "closeApp", "name": "关闭应用", "args": { "id": "baidu" } }

用户输入: 返回
回答: { "command": "back", "name": "返回" }

用户输入: 故障预警
回答: { "command": "notSupport", "name": "未支持指令" }

</Example>
用户的输入如下:
`;
export default async function (question: string, context: any) {
  const token = await getAuth();

  const { data } = await axios.post(
    url,
    {
      tenantId: '1381950445998632962',
      userId: '1519361251260547074',
      extendParams: {
        temperature: 0,
        topP: 1,
        n: 1,
        stream: false,
        presencePenalty: 0,
        frequencyPenalty: 0,
      },
      messages: [
        {
          role: 'assistant',
          content: getPrompt(question, context),
        },
        {
          role: 'user',
          content: question,
        },
        {
          role: 'assistant',
          content: '根据用户需求，返回标准的 JSON 指令协议为',
        },
      ],
    },
    {
      headers: {
        'X-GW-Authorization': token,
      },
    }
  );
  const [head] = data.data.choices;
  const { message } = head;
  const { content } = message;

  try {
    return JSON.parse(content);
  } catch (e) {
    console.warn(e);
  }
}
