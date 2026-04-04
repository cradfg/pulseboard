import { query } from '../index'

export const getUserStats = async (userId: string) => {
  const [commits, streak, languages, activity] = await Promise.all([
    // Total commits
    query(
      `SELECT COUNT(*) as total_commits
       FROM commits WHERE author_id = $1`,
      [userId]
    ),

    // Current streak — consecutive days with commits
    query(
      `WITH daily AS (
         SELECT DATE(committed_at) as day
         FROM commits WHERE author_id = $1
         GROUP BY DATE(committed_at)
         ORDER BY day DESC
       ),
       streak AS (
         SELECT day,
           ROW_NUMBER() OVER (ORDER BY day DESC) as rn,
           day - (ROW_NUMBER() OVER (ORDER BY day DESC) || ' days')::interval as grp
         FROM daily
       )
       SELECT COUNT(*) as current_streak
       FROM streak
       WHERE grp = (SELECT grp FROM streak LIMIT 1)`,
      [userId]
    ),

    // Language breakdown from events
    query(
      `SELECT payload->>'language' as language, COUNT(*) as count
       FROM events
       WHERE user_id = $1
       AND payload->>'language' IS NOT NULL
       GROUP BY language
       ORDER BY count DESC
       LIMIT 5`,
      [userId]
    ),

    // Activity heatmap — commits per day last 90 days
    query(
      `SELECT DATE(received_at) as day, COUNT(*) as count
       FROM events
       WHERE user_id = $1
       AND received_at >= NOW() - INTERVAL '90 days'
       GROUP BY DATE(received_at)
       ORDER BY day ASC`,
      [userId]
    )
  ])

  return {
    totalCommits: parseInt(commits.rows[0]?.total_commits || '0'),
    currentStreak: parseInt(streak.rows[0]?.current_streak || '0'),
    languages: languages.rows,
    activityHeatmap: activity.rows
  }
}

export const getRepoStats = async (repoId: string) => {
  const result = await query(
    `SELECT
       r.name,
       r.full_name,
       r.language,
       COUNT(DISTINCT cs.user_id) as contributor_count,
       SUM(cs.commit_count) as total_commits,
       MAX(cs.last_active_at) as last_active_at
     FROM repositories r
     LEFT JOIN contributor_stats cs ON cs.repo_id = r.id
     WHERE r.id = $1
     GROUP BY r.id`,
    [repoId]
  )
  return result.rows[0] || null
}