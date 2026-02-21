import express, { Request, Response } from 'express';
import db from '../db/init';
import type { SubstitutionRow } from '../types';

const router = express.Router();

// GET /api/substitutions/lookup?ingredient=butter
router.get('/lookup', (req: Request, res: Response): void => {
  try {
    const { ingredient } = req.query;

    if (!ingredient || !(ingredient as string).trim()) {
      res.status(400).json({ error: 'Ingredient parameter is required' }); return;
    }

    const normalized = (ingredient as string).toLowerCase().trim();

    // 1. Exact match
    let results = db.prepare(
      'SELECT * FROM substitutions WHERE ingredient = ? ORDER BY rank ASC'
    ).all(normalized) as SubstitutionRow[];

    // 2. Fallback: LIKE search
    if (results.length === 0) {
      results = db.prepare(
        'SELECT * FROM substitutions WHERE ingredient LIKE ? ORDER BY rank ASC LIMIT 10'
      ).all(`%${normalized}%`) as SubstitutionRow[];
    }

    // 3. Fallback: try individual words (e.g., "all-purpose flour" -> "flour")
    if (results.length === 0) {
      const words = normalized.replace(/-/g, ' ').split(/\s+/);
      for (const word of words.reverse()) { // Try last word first (usually the noun)
        if (word.length < 3) continue;
        results = db.prepare(
          'SELECT * FROM substitutions WHERE ingredient = ? ORDER BY rank ASC'
        ).all(word) as SubstitutionRow[];
        if (results.length > 0) break;
      }
    }

    res.json({
      ingredient: normalized,
      substitutions: results.map(r => ({
        id: r.id,
        substituteName: r.substitute_name,
        ratio: r.ratio,
        ratioNote: r.ratio_note,
        impactNote: r.impact_note,
        category: r.category,
        rank: r.rank
      }))
    });
  } catch (err: unknown) {
    console.error('Substitution lookup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
