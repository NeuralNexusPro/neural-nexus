
/* eslint complexity: "off" */




/**
 * A minimalist `markdown-it` plugin for parsing video/audio references inside
 * markdown image syntax as `<video>` / `<audio>` tags.
 *
 * @namespace HTML5Media
 */

/**
 * @property {Object} messages
 * @property {Object} messages.languageCode
 *  a set of messages identified with a language code, typically an ISO639 code
 * @property {String} messages.languageCode.messageKey
 *  an individual translation of a message to that language, identified with a
 *  message key
 * @typedef {Object} MessagesObj
 */
let messages = {
  en: {
    'html5 video not supported': 'Your browser does not support playing HTML5 video.',
    'html5 audio not supported': 'Your browser does not support playing HTML5 audio.',
    'html5 media fallback link': 'You can <a href="%s" download>download the file</a> instead.',
    'html5 media description': 'Here is a description of the content: %s'
  }
};

/**
 * You can override this function using options.translateFn.
 *
 * @param {String} language
 *  a language code, typically an ISO 639-[1-3] code.
 * @param {String} messageKey
 *  an identifier for the message, typically a short descriptive text
 * @param {String[]} messageParams
 *  Strings to be substituted into the message using some pattern, e.g., %s or
 *  %1$s, %2$s. By default we only use a simple %s pattern.
 * @returns {String}
 *  the translation to use
 * @memberof HTML5Media
 */
let translate = function(language, messageKey, messageParams?) {

  // Revert back to English default if no message object, or no translation
  // for this language
  if (!messages[language] || !messages[language][messageKey])
    language = 'en';

  if (!messages[language])
    return '';

  let message = messages[language][messageKey] || '';

  if (messageParams)
    for (const param of messageParams)
      message = message.replace('%s', param);

  return message;
};


/**
 * A fork of the built-in image tokenizer which guesses video/audio files based
 * on their extension, and tokenizes them accordingly.
 *
 * @param {Object} state
 *  Markdown-It state
 * @param {Boolean} silent
 *  if true, only validate, don't tokenize
 * @param {MarkdownIt} md
 *  instance of Markdown-It used for utility functions
 * @returns {Boolean}
 * @memberof HTML5Media
 */
function tokenizeMedia(state, silent) {
  const videoRE = /\!(video|audio)\[(.*?)\]\((.*?)\)/;

  const pos = state.pos;
  const max = state.posMax;
  const match = state.src.slice(pos, max).match(videoRE);

  if (!match) return false;

  if (silent) return true;

  state.pos = pos + match[0].length;
  const [ _, type, name, url ] = match;
  const token = state.push(type, type, 0);
  token.markup = `!${type}`;
  token.type = type;
  token.info = name; // 视频名称
  token.attrs = [['src', url]]; // 视频链接
  return true;
}

/**
 * Render tokens of the video/audio type to HTML5 tags
 *
 * @param {Object} tokens
 *  token stream
 * @param {Number} idx
 *  which token are we rendering
 * @param {Object} options
 *  Markdown-It options, including this plugin's settings
 * @param {Object} env
 *  Markdown-It environment, potentially including language setting
 * @param {MarkdownIt} md
 *  instance used for utilities access
 * @returns {String}
 *  rendered token
 * @memberof HTML5Media
 */
function renderMedia(tokens, idx, options, env, md) {
  const token = tokens[idx];
  const type = token.type;
  if (type !== 'video' && type !== 'audio')
    return '';
  let attrs = options.html5Media[`${type}Attrs`].trim();
  if (attrs)
    attrs = ' ' + attrs;

  // We'll always have a URL for non-image media: they are detected by URL
  const url = token.attrs[0][1];

  const fallbackText =
    translate(env.language, `html5 ${type} not supported`) + '\n' +
    translate(env.language, 'html5 media fallback link', [url]);

  const description = token.content ?
    '\n' + translate(env.language, 'html5 media description', [md.utils.escapeHtml(token.content)]) :
    '';

  return `<${type} src="${url}"${token.info}${attrs}>\n` +
    `${fallbackText}${description}\n` +
    `</${type}>`;
}


/**
 * The main plugin function, exported as module.exports
 *
 * @param {MarkdownIt} md
 *  instance, automatically passed by md.use
 * @param {Object} [options]
 *  configuration
 * @param {String} [options.videoAttrs='controls class="html5-video-player"']
 *  attributes to include inside `<video>` tags
 * @param {String} [options.audioAttrs='controls class="html5-audio-player"']
 *  attributes to include inside `<audio>` tags
 * @param {MessagesObj} [options.messages=built-in messages]
 *  human-readable text that is part of the output
 * @memberof HTML5Media
 */
function html5Media(md, options: any = {}) {
  if (options.messages)
    messages = options.messages;
  if (options.translateFn)
    translate = options.translateFn;

  const videoAttrs = options.videoAttrs !== undefined ?
    options.videoAttrs :
    'controls class="nexus-video-player"';
  const audioAttrs = options.audioAttrs !== undefined ?
    options.audioAttrs :
    'controls class="nexus-audio-player"';

  md.inline.ruler.push('video', tokenizeMedia);

  md.renderer.rules.video = md.renderer.rules.audio =
    (tokens, idx, opt, env) => {
      opt.html5Media = {
        videoAttrs,
        audioAttrs
      };
      return renderMedia(tokens, idx, opt, env, md);
    };
}

export {
  messages, // For partial customization of messages
};
export default html5Media;