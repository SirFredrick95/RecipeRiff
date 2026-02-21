import express, { Request, Response } from 'express';
import db from '../db/init';
import type { CountResult, MostCookedRow, DateCountResult, DateResult } from '../types';

const router = express.Router();

// GET /api/stats
router.get('/', (req: Request, res: Response): void => {
  try {
    const userId = req.userId;

    // Meals this month
    const mealsThisMonth = (db.prepare(`
      SELECT COUNT(*) as count FROM cook_logs
      WHERE user_id = ? AND cooked_at >= date('now', 'start of month')
    `).get(userId) as CountResult).count;

    // Unique recipes ever cooked
    const uniqueRecipesCooked = (db.prepare(`
      SELECT COUNT(DISTINCT recipe_id) as count FROM cook_logs WHERE user_id = ?
    `).get(userId) as CountResult).count;

    // Total recipes in collection
    const totalRecipes = (db.prepare('SELECT COUNT(*) as count FROM recipes WHERE user_id = ?').get(userId) as CountResult).count;

    // Most cooked (top 5)
    const mostCooked = (db.prepare(`
      SELECT cl.recipe_id, r.title, COUNT(*) as count
      FROM cook_logs cl
      JOIN recipes r ON r.id = cl.recipe_id
      WHERE cl.user_id = ?
      GROUP BY cl.recipe_id
      ORDER BY count DESC
      LIMIT 5
    `).all(userId) as MostCookedRow[]).map(r => ({
      recipeId: r.recipe_id,
      title: r.title,
      count: r.count
    }));

    // Activity grid (last 28 days)
    const activityRows = db.prepare(`
      SELECT DATE(cooked_at) as date, COUNT(*) as count
      FROM cook_logs
      WHERE user_id = ? AND cooked_at >= date('now', '-28 days')
      GROUP BY DATE(cooked_at)
    `).all(userId) as DateCountResult[];

    const activityMap: Record<string, number> = {};
    activityRows.forEach(r => { activityMap[r.date] = r.count; });

    const activityGrid: Array<{ date: string; count: number }> = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      activityGrid.push({ date: dateStr, count: activityMap[dateStr] || 0 });
    }

    // Streak calculation — limit to last 365 days only
    const allCookDates = (db.prepare(`
      SELECT DISTINCT DATE(cooked_at) as date
      FROM cook_logs
      WHERE user_id = ? AND cooked_at >= date('now', '-365 days')
      ORDER BY date DESC
    `).all(userId) as DateResult[]).map(r => r.date);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (allCookDates.includes(todayStr) || allCookDates.includes(yesterdayStr)) {
      const startDate = allCookDates.includes(todayStr) ? today : yesterday;
      const dateSet = new Set(allCookDates);

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() - i);
        const checkStr = checkDate.toISOString().split('T')[0];
        if (dateSet.has(checkStr)) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.json({
      streak,
      mealsThisMonth,
      uniqueRecipesCooked,
      totalRecipes,
      mostCooked,
      activityGrid
    });
  } catch (err: unknown) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
