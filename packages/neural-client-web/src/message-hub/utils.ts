import { HACK_CARD_CODE_BASE_URL } from '@/const';
import { CARD_TYPE_CDN_MAP } from './constants';

export const createRandomId = () => {
  const numbers = '0123456789';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const capital = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chars = numbers + lowercase + capital;

  let randomId = '';
  for (let index = 0; index < 16; index++) {
    randomId += chars[Math.floor(chars.length * Math.random())];
  }

  return randomId;
};

export const getCUICardParamsFromMessage = message => {
  const { cardArgs = [], cardType, customUrl, detailUrl, detailName, copilotFlag, cardPrompt, recommendQuestions = [] } = message;
  const questions = recommendQuestions;
  const args = cardArgs.reduce((pre, current) => {
    pre[current.fieldCode] = current.dataValue;
    return pre;
  }, {});

  if (cardType === 'commonAnswer') {
    return {
      questions,
      code: 'common-answer',
      data: {
        input: {
          ...args,
        },
      },
    };
  }

  // 卡片平台卡片
  if (cardType === 'platform') {
    const [code, version] = customUrl.replace(`${HACK_CARD_CODE_BASE_URL}/`, '').split('@@@');

    return {
      questions,
      code: 'platform-card',
      data: {
        input: {
          args,
          code,
          version,
          copilot: {
            toUrl: detailUrl,
            toName: detailName,
            cardTip: cardPrompt,
            copilot: !!copilotFlag,
          },
        },
      },
    };
  }

  return {
    questions,
    code: 'dynamic-web-component',
    data: {
      input: {
        cdn: CARD_TYPE_CDN_MAP[cardType] || customUrl || '',
        args,
        copilot: {
          toUrl: detailUrl,
          toName: detailName,
          cardTip: cardPrompt,
          copilot: !!copilotFlag,
        },
      },
    },
  };
};
