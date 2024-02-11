// Group Schema
export interface WorkspaceType {
    _id: string
    name: string
    creator: string
    members: string[]
    groups: string[]
    createdAt: string
}
