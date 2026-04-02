export interface GitHubCommit {
  id: string
  message: string
  timestamp: string
  author: {
    name: string
    email: string
  }
  added: string[]
  modified: string[]
  removed: string[]
}

export interface GitHubPushPayload {
  ref: string
  repository: {
    id: number
    name: string
    full_name: string
    language: string
  }
  pusher: {
    name: string
    email: string
  }
  commits: GitHubCommit[]
}