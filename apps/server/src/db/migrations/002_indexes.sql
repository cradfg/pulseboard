CREATE INDEX idx_commits_repo_id ON commits(repo_id);
CREATE INDEX idx_commits_author_id ON commits(author_id);
CREATE INDEX idx_commits_committed_at ON commits(committed_at DESC);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_received_at ON events(received_at DESC);
CREATE INDEX idx_contributor_stats_repo_id ON contributor_stats(repo_id);
CREATE INDEX idx_contributor_stats_commit_count ON contributor_stats(commit_count DESC);