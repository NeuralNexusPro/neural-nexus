// import Runtime, { ITextMsgPayload, INexusMessage } from '@ennew/neural-client-runtime';
import { createTextMessage } from '@/utils/chat'
/**
 * markdown-it 自定义插件
 */

export const MyCommentsPlugin = (md) => {
    function replace(state) {
        // 简单的注释匹配，例如 <!-- 这是一条注释 -->
        state.src = state.src.replace(/<!--(\b)*(.|\n)*(\b)*-->/g, "");
    }

    md.inline.ruler.before('text', 'my_comments', replace);
}

export enum SchemeName {
    Nexus = 'nexus'
}

export enum SchemePath {
    SEND_USER_MSG = 'sendUserMsg'
}
export const NexusMarkdownEvent = '_nexus_markdown_event';
// FIXME: 将 ctx 替代为 runtime

export const initMarkdownEvent = (ctx) => () => {
    window.addEventListener(NexusMarkdownEvent, function(event: CustomEvent) {
        const { text = '', show } = event.detail;
        const parsedText = decodeURIComponent(text);

        ctx.postMessage(createTextMessage(parsedText,  show === 'true' ? true : false));
    });
}
export const NexusLinkPlugin = (md) => {
    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        const defaultRender = (tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options);
        const href = tokens[idx].attrs[0][1]; // 获取链接地址
        const title = tokens[idx + 1].content; // 获取链接标题
      
        const pattern = href.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):((\/\/)?([^\/?#:]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/)
        if (pattern) {
            const [ _all, name, _splitpath, _split, path, _space, _query, param = '' ] = pattern;
            if (name === 'nexus') {
                switch (path) {
                    case SchemePath.SEND_USER_MSG: {
                        const parsedParam = param.split('&').reduce((ret, el) => {
                            const [key, value] = el.split('=');

                            return { ...ret, [key]: value };
                        }, {});
                        const { text, show } = parsedParam;
                        const clickEvent = `window.dispatchEvent(new CustomEvent('${NexusMarkdownEvent}', { detail: { text: '${text || title}', show: '${show}' } }));`; // 创建自定义事件

                        return `<a href="javascript:;" onclick="${clickEvent}">`; 
                    }
                    default:
                        break;
                }
            }
        }
        return defaultRender(tokens, idx, options, env, self);
    };
}