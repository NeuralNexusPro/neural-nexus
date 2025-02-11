// chat响应事件中input类型枚举
export enum TInputTypeEnum {
    // 能力
    ABILITY = "1",
    // 知识库
    KNOWLEDGE = "2",
    // 执行链
    EXEC_FLOW = "3",
    // 业务元数据
    METADATA = "4",
    // 卡片
    CARD = "5",
    // 事件
    EVENT = "6",
}

// 点赞点踩 1 = 赞, -1 = 踩
export enum TFeedbackType {
    GOOD = 1,
    BAD = -1
}

export interface IFeedBackInfo {
    messageId: string; // 后端存取的messageId
    id: string; // 前端标识的反馈的状态  当前回答的id
}