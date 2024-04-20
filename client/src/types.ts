// Group Schema
export interface WorkspaceType {
    _id?: string
    name: string
    creator: string
    members: string[]
    groups?: string[]
    createdAt: number
    invitationToken?: string
    invitationTokenExpiration?: string
}

export interface UserType {
    _id: string
    firstName: string
    lastName: string
    groups: string[]
    workspaces: string[]
}
