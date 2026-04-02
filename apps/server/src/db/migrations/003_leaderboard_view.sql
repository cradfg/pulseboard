CREATE MATERIALIZED VIEW repo_leaderboard AS
SELECT
  cs.repo_id,
  cs.user_id,
  u.username,
  u.avatar_url,
  cs.commit_count,
  cs.lines_added,
  cs.lines_deleted,
  cs.last_active_at,
  RANK() OVER (
    PARTITION BY cs.repo_id
    ORDER BY cs.commit_count DESC
  ) AS rank
FROM contributor_stats cs
JOIN users u ON u.id = cs.user_id
ORDER BY cs.repo_id, rank;

CREATE UNIQUE INDEX idx_leaderboard_user_repo
  ON repo_leaderboard(repo_id, user_id);