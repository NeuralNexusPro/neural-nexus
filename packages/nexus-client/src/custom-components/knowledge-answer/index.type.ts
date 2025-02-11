export type FileType = {
    url: string;
    id: string;
    name: string;
    content: string;
}

export type KnowledgeAnswerData = {
    answerId: string;
    files: FileType[];
    instanceId?: string;
};