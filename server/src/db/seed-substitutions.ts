import Database from 'better-sqlite3';
import type { SubstitutionSeed } from '../types';

/**
 * Seeds the substitutions table with 600+ ingredient substitution mappings.
 * Covers ~130 base ingredients across 16 categories.
 *
 * Columns: ingredient, substitute_name, ratio, ratio_note, impact_note, category, rank
 *   - ratio: multiplier vs original quantity (1 = same amount)
 *   - rank: 0 = best match, higher = less ideal
 */

export default function seedSubstitutions(db: Database.Database): void {
  const insert = db.prepare(`
    INSERT INTO substitutions (ingredient, substitute_name, ratio, ratio_note, impact_note, category, rank)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const rows: SubstitutionSeed[] = [
    // ──────────────── DAIRY ────────────────
    ['butter', 'coconut oil', 1, '1:1', 'Adds slight coconut flavor; works well in baking', 'dairy', 0],
    ['butter', 'olive oil', 0.75, '3/4 cup per 1 cup butter', 'Best for savory dishes; different texture in baking', 'dairy', 1],
    ['butter', 'applesauce', 0.5, '1/2 cup per 1 cup butter', 'Reduces fat; adds moisture and slight sweetness', 'dairy', 2],
    ['butter', 'avocado', 1, '1:1', 'Creamy texture; adds healthy fats', 'dairy', 3],
    ['butter', 'ghee', 1, '1:1', 'Clarified butter; nutty flavor, lactose-free', 'dairy', 4],
    ['butter', 'greek yogurt', 0.5, '1/2 cup per 1 cup butter', 'Adds protein and tang; keeps baked goods moist', 'dairy', 5],
    ['butter', 'vegan butter', 1, '1:1', 'Direct swap; check brand for baking performance', 'dairy', 6],
    ['butter', 'margarine', 1, '1:1', 'Works in baking; may be slightly less rich', 'dairy', 7],
    ['butter', 'mashed banana', 0.5, '1/2 cup per 1 cup butter', 'For baking only; adds banana flavor and natural sweetness', 'dairy', 8],

    ['milk', 'oat milk', 1, '1:1', 'Creamy, neutral flavor; great for baking', 'dairy', 0],
    ['milk', 'almond milk', 1, '1:1', 'Thinner consistency; slight nutty taste', 'dairy', 1],
    ['milk', 'soy milk', 1, '1:1', 'Closest protein content to dairy milk', 'dairy', 2],
    ['milk', 'coconut milk', 1, '1:1', 'Richer; adds coconut flavor', 'dairy', 3],
    ['milk', 'cashew milk', 1, '1:1', 'Very creamy; neutral flavor', 'dairy', 4],
    ['milk', 'water with butter', 1, '1 cup water + 1 tbsp butter', 'Quick fix; lacks richness of milk', 'dairy', 5],
    ['milk', 'rice milk', 1, '1:1', 'Thin and slightly sweet; good for baking', 'dairy', 6],

    ['heavy cream', 'coconut cream', 1, '1:1', 'Rich and thick; slight coconut flavor', 'dairy', 0],
    ['heavy cream', 'cashew cream', 1, '1:1 (blend soaked cashews)', 'Neutral flavor; good for sauces', 'dairy', 1],
    ['heavy cream', 'evaporated milk', 1, '1:1', 'Lower fat; slightly caramelized flavor', 'dairy', 2],
    ['heavy cream', 'silken tofu blended', 1, '1:1', 'High protein; very neutral when blended smooth', 'dairy', 3],
    ['heavy cream', 'milk + butter', 1, '3/4 cup milk + 1/4 cup melted butter', 'Approximates fat content; not whippable', 'dairy', 4],

    ['half-and-half', 'milk + cream', 1, '1/2 cup milk + 1/2 cup cream', 'Equal parts whole milk and heavy cream', 'dairy', 0],
    ['half-and-half', 'milk + butter', 1, '7/8 cup milk + 1/8 cup melted butter', 'Quick substitute; similar fat content', 'dairy', 1],
    ['half-and-half', 'evaporated milk', 1, '1:1', 'Slightly caramelized flavor; works well', 'dairy', 2],
    ['half-and-half', 'coconut cream + milk', 1, '1:1 mix', 'Vegan option; slight coconut flavor', 'dairy', 3],

    ['sour cream', 'greek yogurt', 1, '1:1', 'Tangier; higher protein', 'dairy', 0],
    ['sour cream', 'cottage cheese blended', 1, '1:1', 'Blend until smooth; milder flavor', 'dairy', 1],
    ['sour cream', 'cashew cream + lemon', 1, '1:1', 'Vegan option; add 1 tsp lemon juice per cup', 'dairy', 2],
    ['sour cream', 'coconut cream + lemon', 1, '1:1', 'Vegan; slight coconut taste', 'dairy', 3],

    ['cream cheese', 'mascarpone', 1, '1:1', 'Richer and less tangy', 'dairy', 0],
    ['cream cheese', 'cashew cream cheese', 1, '1:1', 'Vegan; slightly different texture', 'dairy', 1],
    ['cream cheese', 'ricotta', 1, '1:1', 'Grainier texture; milder flavor', 'dairy', 2],
    ['cream cheese', 'greek yogurt strained', 1, '1:1 (strain overnight)', 'Tangier; lower fat', 'dairy', 3],
    ['cream cheese', 'neufchatel', 1, '1:1', 'Lower fat version; very similar taste', 'dairy', 4],

    ['yogurt', 'sour cream', 1, '1:1', 'Richer; less tangy', 'dairy', 0],
    ['yogurt', 'coconut yogurt', 1, '1:1', 'Vegan; slight coconut flavor', 'dairy', 1],
    ['yogurt', 'buttermilk', 1, '1:1', 'Thinner; use in baking and marinades', 'dairy', 2],
    ['yogurt', 'silken tofu blended', 1, '1:1', 'Vegan; neutral flavor', 'dairy', 3],

    ['buttermilk', 'milk + vinegar', 1, '1 cup milk + 1 tbsp vinegar, rest 5 min', 'Easy homemade substitute', 'dairy', 0],
    ['buttermilk', 'milk + lemon juice', 1, '1 cup milk + 1 tbsp lemon juice', 'Slightly citrusy', 'dairy', 1],
    ['buttermilk', 'yogurt thinned', 1, '3/4 cup yogurt + 1/4 cup milk', 'Thicker; good for baking', 'dairy', 2],
    ['buttermilk', 'kefir', 1, '1:1', 'Probiotic-rich; similar tanginess', 'dairy', 3],

    // ──────────────── CHEESE ────────────────
    ['parmesan', 'pecorino romano', 1, '1:1', 'Saltier and sharper; reduce other salt', 'cheese', 0],
    ['parmesan', 'nutritional yeast', 0.75, '3/4 amount', 'Vegan; cheesy umami flavor', 'cheese', 1],
    ['parmesan', 'asiago', 1, '1:1', 'Similar aged cheese; slightly milder', 'cheese', 2],
    ['parmesan', 'grana padano', 1, '1:1', 'Milder, less expensive Italian hard cheese', 'cheese', 3],

    ['mozzarella', 'provolone', 1, '1:1', 'Melts well; slightly sharper', 'cheese', 0],
    ['mozzarella', 'monterey jack', 1, '1:1', 'Good melting; milder flavor', 'cheese', 1],
    ['mozzarella', 'cashew mozzarella', 1, '1:1', 'Vegan; different melt behavior', 'cheese', 2],
    ['mozzarella', 'young gouda', 1, '1:1', 'Creamy; melts smoothly', 'cheese', 3],

    ['cheddar', 'gouda', 1, '1:1', 'Creamy; slightly sweeter', 'cheese', 0],
    ['cheddar', 'colby', 1, '1:1', 'Milder; similar texture', 'cheese', 1],
    ['cheddar', 'gruyere', 1, '1:1', 'Nuttier, more complex flavor', 'cheese', 2],
    ['cheddar', 'vegan cheddar', 1, '1:1', 'Dairy-free; texture varies by brand', 'cheese', 3],

    ['ricotta', 'cottage cheese', 1, '1:1 (blend for smooth)', 'Lumpier texture; similar flavor', 'cheese', 0],
    ['ricotta', 'mascarpone', 1, '1:1', 'Richer; less grainy', 'cheese', 1],
    ['ricotta', 'tofu ricotta', 1, '1:1 (crumble firm tofu)', 'Vegan; season with lemon and nutritional yeast', 'cheese', 2],
    ['ricotta', 'cream cheese thinned', 1, '1:1 (thin with milk)', 'Smoother; tangier', 'cheese', 3],

    ['feta', 'goat cheese', 1, '1:1', 'Creamier; similar tanginess', 'cheese', 0],
    ['feta', 'cotija', 1, '1:1', 'Salty, crumbly Mexican cheese', 'cheese', 1],
    ['feta', 'tofu feta', 1, '1:1 (marinate in lemon + herbs)', 'Vegan; crumbly texture', 'cheese', 2],

    ['goat cheese', 'feta', 1, '1:1', 'More crumbly; saltier', 'cheese', 0],
    ['goat cheese', 'cream cheese', 1, '1:1', 'Milder; less tangy', 'cheese', 1],
    ['goat cheese', 'boursin', 1, '1:1', 'Herbed and creamy', 'cheese', 2],

    ['gruyere', 'swiss cheese', 1, '1:1', 'Milder; similar melt', 'cheese', 0],
    ['gruyere', 'comte', 1, '1:1', 'Very similar French cheese', 'cheese', 1],
    ['gruyere', 'fontina', 1, '1:1', 'Creamy; great melter', 'cheese', 2],
    ['gruyere', 'emmental', 1, '1:1', 'Sweeter; iconic holes', 'cheese', 3],

    // ──────────────── EGGS ────────────────
    ['egg', 'flax egg', 1, '1 tbsp ground flax + 3 tbsp water per egg', 'Vegan; binding only, not leavening', 'eggs', 0],
    ['egg', 'chia egg', 1, '1 tbsp chia seeds + 3 tbsp water per egg', 'Vegan; slight texture difference', 'eggs', 1],
    ['egg', 'applesauce', 1, '1/4 cup per egg', 'Adds moisture and sweetness; good for muffins', 'eggs', 2],
    ['egg', 'mashed banana', 1, '1/4 cup per egg', 'Adds banana flavor; good for pancakes', 'eggs', 3],
    ['egg', 'silken tofu', 1, '1/4 cup blended per egg', 'Neutral flavor; good for dense baked goods', 'eggs', 4],
    ['egg', 'aquafaba', 1, '3 tbsp per egg', 'Chickpea brine; can whip like egg whites', 'eggs', 5],
    ['egg', 'commercial egg replacer', 1, 'Follow package directions', 'Designed for baking; most reliable', 'eggs', 6],
    ['egg', 'yogurt', 1, '1/4 cup per egg', 'Adds moisture and tang', 'eggs', 7],
    ['egg', 'baking soda + vinegar', 1, '1 tsp soda + 1 tbsp vinegar per egg', 'For leavening only; good in cakes', 'eggs', 8],

    ['egg white', 'aquafaba', 1, '3 tbsp per egg white', 'Whips to stiff peaks; from canned chickpeas', 'eggs', 0],
    ['egg white', 'meringue powder', 1, 'Follow package directions', 'Shelf-stable; consistent results', 'eggs', 1],

    ['egg yolk', 'soy lecithin', 1, '1 tbsp per yolk', 'Emulsifier; for sauces and dressings', 'eggs', 0],
    ['egg yolk', 'mashed avocado', 1, '1 tbsp per yolk', 'Rich fat; for baking only', 'eggs', 1],

    // ──────────────── FLOURS ────────────────
    ['all-purpose flour', 'whole wheat flour', 1, '1:1', 'Denser; nuttier flavor; may need more liquid', 'flours', 0],
    ['all-purpose flour', 'gluten-free flour blend', 1, '1:1', 'Use a blend with xanthan gum for best results', 'flours', 1],
    ['all-purpose flour', 'almond flour', 1, '1:1 (increase eggs)', 'Gluten-free; denser, nuttier', 'flours', 2],
    ['all-purpose flour', 'oat flour', 1, '1:1', 'Slightly sweet; softer texture', 'flours', 3],
    ['all-purpose flour', 'spelt flour', 1, '1:1', 'Nutty; contains gluten but less than wheat', 'flours', 4],
    ['all-purpose flour', 'cassava flour', 1, '1:1', 'Grain-free; light and neutral', 'flours', 5],
    ['all-purpose flour', 'rice flour', 1, '1:1 (may need binder)', 'Gluten-free; lighter texture', 'flours', 6],
    ['all-purpose flour', 'chickpea flour', 1, '1:1', 'Gluten-free; nutty, earthy flavor; high protein', 'flours', 7],
    ['all-purpose flour', 'buckwheat flour', 1, '1:1', 'Gluten-free despite the name; strong nutty flavor', 'flours', 8],

    ['bread flour', 'all-purpose flour', 1, '1:1', 'Less chewy result; slightly lower protein', 'flours', 0],
    ['bread flour', 'all-purpose flour + vital wheat gluten', 1, '1 cup AP + 1 tsp gluten', 'Closer protein match', 'flours', 1],

    ['self-rising flour', 'all-purpose flour + baking powder + salt', 1, '1 cup AP + 1.5 tsp baking powder + 1/4 tsp salt', 'Homemade equivalent; measure carefully', 'flours', 0],
    ['self-rising flour', 'whole wheat flour + baking powder + salt', 1, '1 cup WW + 1.5 tsp baking powder + 1/4 tsp salt', 'Denser result; more fiber', 'flours', 1],

    ['cake flour', 'all-purpose flour + cornstarch', 1, '1 cup minus 2 tbsp AP + 2 tbsp cornstarch', 'Lower protein; softer crumb', 'flours', 0],
    ['cake flour', 'all-purpose flour', 1, '1:1', 'Slightly denser result', 'flours', 1],

    ['cornstarch', 'arrowroot powder', 1, '1:1', 'Clear finish; great for sauces', 'flours', 0],
    ['cornstarch', 'tapioca starch', 1, '1:1', 'Slightly chewy; good for pies', 'flours', 1],
    ['cornstarch', 'potato starch', 1, '1:1', 'Good thickener; breaks down with prolonged heat', 'flours', 2],
    ['cornstarch', 'all-purpose flour', 2, '2 tbsp flour per 1 tbsp cornstarch', 'Less clear finish; takes longer to thicken', 'flours', 3],

    ['almond flour', 'oat flour', 1, '1:1', 'Nut-free; lighter texture', 'flours', 0],
    ['almond flour', 'sunflower seed flour', 1, '1:1', 'Nut-free; may turn green from chlorophyll reaction', 'flours', 1],
    ['almond flour', 'coconut flour', 0.25, '1/4 cup per 1 cup almond flour', 'Very absorbent; increase eggs and liquid', 'flours', 2],

    ['coconut flour', 'almond flour', 4, '4 cups almond flour per 1 cup coconut', 'Much less absorbent; adjust liquid down', 'flours', 0],
    ['coconut flour', 'oat flour', 4, '4 cups oat flour per 1 cup coconut', 'Adjust liquid down significantly', 'flours', 1],

    ['xanthan gum', 'psyllium husk powder', 2, '2 tsp per 1 tsp xanthan', 'Works as binder in GF baking; absorbs more liquid', 'flours', 0],
    ['xanthan gum', 'chia seeds ground + water', 1, '1 tsp ground chia + 2 tsp water per tsp xanthan', 'Natural binder; adds fiber', 'flours', 1],
    ['xanthan gum', 'flax meal + water', 1, '1 tsp flax + 2 tsp water per tsp xanthan', 'Similar binding; slight nutty flavor', 'flours', 2],

    // ──────────────── SWEETENERS ────────────────
    ['sugar', 'honey', 0.75, '3/4 cup per 1 cup sugar', 'Reduce liquid by 2 tbsp; lower oven temp 25F', 'sweeteners', 0],
    ['sugar', 'maple syrup', 0.75, '3/4 cup per 1 cup sugar', 'Reduce liquid by 3 tbsp; distinct maple flavor', 'sweeteners', 1],
    ['sugar', 'coconut sugar', 1, '1:1', 'Lower glycemic; caramel-like flavor', 'sweeteners', 2],
    ['sugar', 'stevia', 0.02, '1 tsp per 1 cup sugar', 'Zero calorie; can have bitter aftertaste', 'sweeteners', 3],
    ['sugar', 'monk fruit sweetener', 1, '1:1 (granulated blend)', 'Zero calorie; no bitter aftertaste', 'sweeteners', 4],
    ['sugar', 'date paste', 0.67, '2/3 cup per 1 cup sugar', 'Whole food; adds fiber and minerals', 'sweeteners', 5],
    ['sugar', 'agave nectar', 0.67, '2/3 cup per 1 cup sugar', 'Very sweet; reduce liquid slightly', 'sweeteners', 6],

    ['brown sugar', 'white sugar + molasses', 1, '1 cup sugar + 1 tbsp molasses', 'Exact replica of commercial brown sugar', 'sweeteners', 0],
    ['brown sugar', 'coconut sugar', 1, '1:1', 'Similar caramel depth', 'sweeteners', 1],
    ['brown sugar', 'maple syrup', 0.75, '3/4 cup per 1 cup', 'Reduce other liquid; adds maple flavor', 'sweeteners', 2],
    ['brown sugar', 'date sugar', 1, '1:1', "Doesn't melt well; best in crumbles and streusel", 'sweeteners', 3],

    ['powdered sugar', 'blended granulated sugar', 1, '1:1 (blend until fine)', 'Add 1 tsp cornstarch per cup', 'sweeteners', 0],
    ['powdered sugar', 'blended coconut sugar', 1, '1:1 (blend until fine)', 'Darker color; slight caramel flavor', 'sweeteners', 1],

    ['honey', 'maple syrup', 1, '1:1', 'Different flavor profile; works in most recipes', 'sweeteners', 0],
    ['honey', 'agave nectar', 1, '1:1', 'Milder flavor; thinner consistency', 'sweeteners', 1],
    ['honey', 'brown rice syrup', 1.33, '1 1/3 cups per 1 cup honey', 'Less sweet; malty flavor', 'sweeteners', 2],
    ['honey', 'date syrup', 1, '1:1', 'Rich, caramel-like sweetness', 'sweeteners', 3],
    ['honey', 'molasses', 1, '1:1', 'Much stronger flavor; use light molasses', 'sweeteners', 4],

    ['maple syrup', 'honey', 1, '1:1', 'Sweeter; floral flavor instead of maple', 'sweeteners', 0],
    ['maple syrup', 'agave nectar', 1, '1:1', 'Milder; less complex flavor', 'sweeteners', 1],
    ['maple syrup', 'brown sugar syrup', 1, '1:1 (dissolve in equal part water)', 'Quick homemade substitute', 'sweeteners', 2],

    ['corn syrup', 'golden syrup', 1, '1:1', 'British equivalent; slightly different flavor', 'sweeteners', 0],
    ['corn syrup', 'honey', 1, '1:1', 'Adds flavor; may crystallize differently', 'sweeteners', 1],
    ['corn syrup', 'agave nectar', 1, '1:1', 'Similar viscosity; less sticky', 'sweeteners', 2],

    ['molasses', 'dark corn syrup', 1, '1:1', 'Less complex flavor; similar consistency', 'sweeteners', 0],
    ['molasses', 'maple syrup', 1, '1:1', 'Lighter flavor; works for marinades', 'sweeteners', 1],
    ['molasses', 'black treacle', 1, '1:1', 'Very similar; British equivalent', 'sweeteners', 2],

    // ──────────────── OILS & FATS ────────────────
    ['vegetable oil', 'canola oil', 1, '1:1', 'Neutral flavor; same smoke point', 'oils', 0],
    ['vegetable oil', 'avocado oil', 1, '1:1', 'Higher smoke point; neutral flavor', 'oils', 1],
    ['vegetable oil', 'melted coconut oil', 1, '1:1', 'May add slight coconut flavor', 'oils', 2],
    ['vegetable oil', 'grapeseed oil', 1, '1:1', 'Very neutral; high smoke point', 'oils', 3],
    ['vegetable oil', 'applesauce', 0.5, '1/2 cup per 1 cup oil', 'Reduces fat in baking; adds moisture', 'oils', 4],
    ['vegetable oil', 'melted butter', 1, '1:1', 'Adds richness; not for high heat', 'oils', 5],

    ['olive oil', 'avocado oil', 1, '1:1', 'Neutral; good for higher heat', 'oils', 0],
    ['olive oil', 'grapeseed oil', 1, '1:1', 'Very neutral; light body', 'oils', 1],
    ['olive oil', 'walnut oil', 1, '1:1', 'Nutty; best for dressings and finishing', 'oils', 2],
    ['olive oil', 'sesame oil', 1, '1:1', 'Strong flavor; best for Asian dishes', 'oils', 3],

    ['coconut oil', 'butter', 1, '1:1', 'Similar fat content; dairy flavor', 'oils', 0],
    ['coconut oil', 'avocado oil', 1, '1:1', 'Neutral flavor; liquid at room temp', 'oils', 1],
    ['coconut oil', 'vegetable shortening', 1, '1:1', 'Similar texture when solid', 'oils', 2],

    ['sesame oil', 'tahini thinned with neutral oil', 1, '1:1', 'Maintains sesame flavor', 'oils', 0],
    ['sesame oil', 'perilla oil', 1, '1:1', 'Korean alternative; slightly different nutty note', 'oils', 1],
    ['sesame oil', 'walnut oil', 1, '1:1', 'Different nutty profile; works in dressings', 'oils', 2],

    ['shortening', 'butter', 1, '1:1', 'Adds flavor; slightly less flaky pastry', 'oils', 0],
    ['shortening', 'coconut oil', 1, '1:1', 'Vegan; similar texture when cold', 'oils', 1],
    ['shortening', 'lard', 1, '1:1', 'Excellent for pie crusts; not vegetarian', 'oils', 2],

    ['lard', 'butter', 1, '1:1', 'Different flavor; works in most contexts', 'oils', 0],
    ['lard', 'shortening', 1, '1:1', 'Vegetarian; less flavor', 'oils', 1],
    ['lard', 'coconut oil', 1, '1:1', 'Vegan; slight coconut flavor', 'oils', 2],

    // ──────────────── CONDIMENTS & SAUCES ────────────────
    ['soy sauce', 'tamari', 1, '1:1', 'Gluten-free; slightly richer', 'condiments', 0],
    ['soy sauce', 'coconut aminos', 1, '1:1', 'Soy-free; sweeter, less salty', 'condiments', 1],
    ['soy sauce', 'liquid aminos', 1, '1:1', 'Similar depth; slightly different amino profile', 'condiments', 2],
    ['soy sauce', 'worcestershire sauce', 0.5, '1/2 amount + salt to taste', 'Different flavor; adds umami', 'condiments', 3],
    ['soy sauce', 'fish sauce', 0.5, '1/2 amount (very strong)', 'Very salty and pungent; use carefully', 'condiments', 4],

    ['fish sauce', 'soy sauce + lime juice', 1, '1:1 soy + squeeze of lime', 'Lacks funk; adds salt and umami', 'condiments', 0],
    ['fish sauce', 'coconut aminos + seaweed', 1, '1:1', 'Vegan; less pungent', 'condiments', 1],
    ['fish sauce', 'worcestershire sauce', 1, '1:1', 'Similar umami depth; contains anchovy', 'condiments', 2],

    ['worcestershire sauce', 'soy sauce + vinegar + sugar', 1, '1:1 (mix equal parts soy+vinegar, pinch sugar)', 'Quick substitute; missing tamarind', 'condiments', 0],
    ['worcestershire sauce', 'coconut aminos + balsamic', 1, '1:1', 'Sweeter; vegan', 'condiments', 1],

    ['ketchup', 'tomato paste + vinegar + sugar', 1, '1 tbsp paste + 1 tsp vinegar + 1 tsp sugar per tbsp ketchup', 'More concentrated tomato flavor', 'condiments', 0],
    ['ketchup', 'salsa', 1, '1:1', 'Chunkier; adds heat', 'condiments', 1],

    ['mustard', 'horseradish', 0.5, '1/2 amount', 'Sharper heat; no tang', 'condiments', 0],
    ['mustard', 'wasabi paste', 0.25, '1/4 amount', 'Very hot; completely different flavor', 'condiments', 1],
    ['mustard', 'mustard powder + vinegar', 1, '1 tsp powder + 1 tsp vinegar per tbsp', 'Homemade; adjust to taste', 'condiments', 2],

    ['mayonnaise', 'greek yogurt', 1, '1:1', 'Lower fat; tangier', 'condiments', 0],
    ['mayonnaise', 'avocado mashed', 1, '1:1', 'Creamy; adds nutrition', 'condiments', 1],
    ['mayonnaise', 'silken tofu blended', 1, '1:1', 'Vegan; neutral flavor', 'condiments', 2],
    ['mayonnaise', 'hummus', 1, '1:1', 'Adds flavor; works as spread', 'condiments', 3],

    ['hot sauce', 'sriracha', 1, '1:1', 'Different heat profile; garlicky', 'condiments', 0],
    ['hot sauce', 'red pepper flakes', 0.25, '1/4 tsp per tsp hot sauce', 'Dry heat; no vinegar tang', 'condiments', 1],
    ['hot sauce', 'cayenne + vinegar', 1, '1:1 (pinch cayenne + vinegar)', 'Simple substitute; adjust heat to taste', 'condiments', 2],

    ['tomato paste', 'tomato sauce reduced', 3, '3 tbsp sauce per 1 tbsp paste', 'Cook down to thicken; less concentrated', 'condiments', 0],
    ['tomato paste', 'sun-dried tomato puree', 1, '1:1', 'Sweeter; more intense tomato flavor', 'condiments', 1],
    ['tomato paste', 'ketchup', 1, '1:1', 'Sweeter; adds vinegar notes', 'condiments', 2],

    ['tomato sauce', 'crushed tomatoes', 1, '1:1 (blend if needed)', 'Chunkier; fresher taste', 'condiments', 0],
    ['tomato sauce', 'tomato paste + water', 1, '1/3 cup paste + 2/3 cup water', 'More concentrated base', 'condiments', 1],

    ['vinegar', 'lemon juice', 1, '1:1', 'Citrusy; works for most cooking purposes', 'condiments', 0],
    ['vinegar', 'lime juice', 1, '1:1', 'More tart; good for Mexican/Asian dishes', 'condiments', 1],
    ['vinegar', 'white wine', 1, '1:1', 'Milder acidity; adds complexity', 'condiments', 2],

    ['balsamic vinegar', 'red wine vinegar + honey', 1, '1:1 (add pinch of honey)', 'Less complex; similar sweet-tart balance', 'condiments', 0],
    ['balsamic vinegar', 'sherry vinegar', 1, '1:1', 'Similar complexity; nuttier', 'condiments', 1],
    ['balsamic vinegar', 'apple cider vinegar + molasses', 1, '1:1 vinegar + 1/2 tsp molasses', 'Approximates color and sweetness', 'condiments', 2],

    ['rice vinegar', 'apple cider vinegar', 1, '1:1 (add pinch sugar)', 'Slightly stronger; add sugar to mellow', 'condiments', 0],
    ['rice vinegar', 'white wine vinegar', 1, '1:1 (add pinch sugar)', 'Sharper; sugar balances it', 'condiments', 1],
    ['rice vinegar', 'champagne vinegar', 1, '1:1', 'Delicate flavor; works well in Asian dishes', 'condiments', 2],

    ['dijon mustard', 'yellow mustard + pinch sugar', 1, '1:1 + small pinch sugar', 'Milder; less complex; readily available', 'condiments', 0],
    ['dijon mustard', 'stone-ground mustard', 1, '1:1', 'Coarser texture; similar tang', 'condiments', 1],
    ['dijon mustard', 'spicy brown mustard', 1, '1:1', 'Similar heat; slightly different flavor', 'condiments', 2],
    ['dijon mustard', 'horseradish + vinegar', 0.5, '1/2 amount', 'For heat only; different flavor profile', 'condiments', 3],

    ['apple cider vinegar', 'white wine vinegar', 1, '1:1', 'Less fruity; works in most recipes', 'condiments', 0],
    ['apple cider vinegar', 'lemon juice', 1, '1:1', 'Citrusy; similar acidity level', 'condiments', 1],
    ['apple cider vinegar', 'rice vinegar', 1, '1:1', 'Milder; slightly sweeter', 'condiments', 2],
    ['apple cider vinegar', 'sherry vinegar', 1, '1:1', 'More complex; nuttier flavor', 'condiments', 3],

    ['white wine vinegar', 'champagne vinegar', 1, '1:1', 'Very similar; slightly milder', 'condiments', 0],
    ['white wine vinegar', 'rice vinegar', 1, '1:1', 'Milder and sweeter', 'condiments', 1],
    ['white wine vinegar', 'apple cider vinegar', 1, '1:1', 'Fruitier; works in dressings', 'condiments', 2],
    ['white wine vinegar', 'lemon juice', 1, '1:1', 'Different acidity profile; citrus notes', 'condiments', 3],

    ['teriyaki sauce', 'soy sauce + honey + garlic + ginger', 1, '3 tbsp soy + 1 tbsp honey + garlic + ginger per 1/4 cup', 'Homemade version; adjust sweetness to taste', 'condiments', 0],
    ['teriyaki sauce', 'coconut aminos + maple syrup', 1, '3:1 ratio aminos to syrup', 'Soy-free; similar sweet-savory profile', 'condiments', 1],

    ['bbq sauce', 'ketchup + brown sugar + vinegar + worcestershire', 1, '1/2 cup ketchup + 2 tbsp each of rest', 'Quick homemade; adjust to taste', 'condiments', 0],
    ['bbq sauce', 'hoisin sauce', 1, '1:1', 'Asian twist; similar sweet-savory profile', 'condiments', 1],

    ['ranch dressing', 'greek yogurt + herbs + garlic + lemon', 1, '1 cup yogurt + dried dill + garlic powder + lemon', 'Healthier; tangier; works as dip or dressing', 'condiments', 0],
    ['ranch dressing', 'buttermilk + mayo + herbs', 1, '1/2 cup each + herbs', 'Classic homemade base', 'condiments', 1],

    // ──────────────── HERBS & SPICES ────────────────
    ['basil', 'oregano', 1, '1:1', 'Different flavor; works in Italian dishes', 'herbs', 0],
    ['basil', 'Italian seasoning', 0.5, '1/2 amount', 'Blend includes basil; adds other herbs', 'herbs', 1],
    ['basil', 'spinach + pinch oregano', 1, '1:1', 'For pesto; adds green color and body', 'herbs', 2],
    ['basil', 'thai basil', 1, '1:1', 'Anise notes; works in Asian and Italian', 'herbs', 3],

    ['cilantro', 'flat-leaf parsley', 1, '1:1', 'Different flavor; works for garnish', 'herbs', 0],
    ['cilantro', 'thai basil', 1, '1:1', 'Aromatic; good in Asian dishes', 'herbs', 1],
    ['cilantro', 'dill', 0.5, '1/2 amount', 'Different flavor profile; use sparingly', 'herbs', 2],
    ['cilantro', 'culantro', 0.5, '1/2 amount', 'Stronger cilantro-like flavor', 'herbs', 3],

    ['parsley', 'cilantro', 1, '1:1', 'Stronger flavor; may change taste', 'herbs', 0],
    ['parsley', 'chervil', 1, '1:1', 'Delicate; French cuisine favorite', 'herbs', 1],
    ['parsley', 'celery leaves', 1, '1:1', 'Mild; good for garnish', 'herbs', 2],

    ['rosemary', 'thyme', 1, '1:1', 'Milder; works in most savory dishes', 'herbs', 0],
    ['rosemary', 'sage', 0.5, '1/2 amount', 'Strong flavor; use less', 'herbs', 1],
    ['rosemary', 'oregano', 1, '1:1', 'Mediterranean flavor; different profile', 'herbs', 2],

    ['thyme', 'oregano', 1, '1:1', 'Slightly stronger; Mediterranean herb', 'herbs', 0],
    ['thyme', 'herbes de provence', 1, '1:1', 'Blend includes thyme', 'herbs', 1],
    ['thyme', 'marjoram', 1, '1:1', 'Milder and sweeter; close relative', 'herbs', 2],

    ['oregano', 'marjoram', 1, '1:1', 'Milder, sweeter version of oregano', 'herbs', 0],
    ['oregano', 'basil', 1, '1:1', 'Different profile; works in Italian', 'herbs', 1],
    ['oregano', 'thyme', 1, '1:1', 'Earthier; good for meat dishes', 'herbs', 2],

    ['sage', 'poultry seasoning', 0.75, '3/4 amount', 'Contains sage; adds other herbs', 'herbs', 0],
    ['sage', 'marjoram', 1, '1:1', 'Milder; similar earthiness', 'herbs', 1],
    ['sage', 'rosemary', 0.5, '1/2 amount', 'Piney flavor; use less', 'herbs', 2],

    ['dill', 'fennel fronds', 1, '1:1', 'Anise flavor; visual substitute', 'herbs', 0],
    ['dill', 'tarragon', 0.5, '1/2 amount', 'Anise-like; stronger flavor', 'herbs', 1],

    ['mint', 'basil', 1, '1:1', 'Different flavor; fresh and aromatic', 'herbs', 0],
    ['mint', 'peppermint extract', 0.1, '1/8 tsp per tbsp fresh mint', 'Very concentrated; for baking', 'herbs', 1],

    ['bay leaf', 'thyme', 0.25, '1/4 tsp dried thyme per bay leaf', 'Different flavor; adds herbal note', 'herbs', 0],
    ['bay leaf', 'oregano', 0.25, '1/4 tsp dried oregano per bay leaf', 'Mediterranean; slight bitterness', 'herbs', 1],

    ['cumin', 'coriander', 1, '1:1', 'Lighter, citrusy; works in same cuisines', 'herbs', 0],
    ['cumin', 'chili powder', 0.5, '1/2 amount', 'Contains cumin; adds heat and other spices', 'herbs', 1],
    ['cumin', 'caraway seeds', 1, '1:1', 'Similar earthy flavor; related plant', 'herbs', 2],

    ['cinnamon', 'allspice', 0.5, '1/2 amount', 'Stronger; contains cinnamon-like notes', 'herbs', 0],
    ['cinnamon', 'nutmeg', 0.5, '1/2 amount', 'Warmer; more intense', 'herbs', 1],
    ['cinnamon', 'cardamom', 0.5, '1/2 amount', 'Floral and complex; different profile', 'herbs', 2],

    ['nutmeg', 'mace', 1, '1:1', 'Same plant; slightly milder', 'herbs', 0],
    ['nutmeg', 'cinnamon', 0.5, '1/2 amount', 'Warmer; less complex', 'herbs', 1],
    ['nutmeg', 'allspice', 0.5, '1/2 amount', 'Contains nutmeg-like notes', 'herbs', 2],

    ['ginger', 'ground ginger', 0.25, '1/4 tsp per tbsp fresh', 'More concentrated; lacks brightness', 'herbs', 0],
    ['ginger', 'allspice', 0.5, '1/2 amount (for baking)', 'Warm; different flavor', 'herbs', 1],
    ['ginger', 'galangal', 1, '1:1', 'Related root; pinier, more floral', 'herbs', 2],

    ['turmeric', 'saffron', 0.1, 'small pinch per tsp turmeric', 'Expensive; adds color and distinct flavor', 'herbs', 0],
    ['turmeric', 'annatto', 0.5, '1/2 amount', 'For color; mild earthy flavor', 'herbs', 1],
    ['turmeric', 'curry powder', 0.5, '1/2 amount', 'Contains turmeric; adds other spices', 'herbs', 2],

    ['paprika', 'cayenne pepper', 0.25, '1/4 amount', 'Much hotter; use carefully', 'herbs', 0],
    ['paprika', 'ancho chili powder', 1, '1:1', 'Mild, smoky; good substitute for smoked paprika', 'herbs', 1],
    ['paprika', 'chipotle powder', 0.5, '1/2 amount', 'Smoky and hot; use less', 'herbs', 2],

    ['garlic', 'garlic powder', 0.25, '1/4 tsp per clove', 'Convenient; less pungent', 'herbs', 0],
    ['garlic', 'garlic paste', 1, '1 tsp per clove', 'Similar flavor; already minced', 'herbs', 1],
    ['garlic', 'shallot', 2, '2 shallots per 3 cloves', 'Milder; adds sweetness', 'herbs', 2],
    ['garlic', 'asafoetida', 0.125, '1/8 tsp per clove', 'Indian spice; onion-garlic flavor', 'herbs', 3],
    ['garlic', 'garlic granules', 0.5, '1/2 tsp per clove', 'Coarser than powder; good for rubs', 'herbs', 4],

    ['onion', 'shallot', 1, '1:1', 'Milder, sweeter; elegant substitute', 'herbs', 0],
    ['onion', 'leek (white part)', 1, '1:1', 'Milder; great in soups and stews', 'herbs', 1],
    ['onion', 'onion powder', 0.18, '1 tbsp per medium onion', 'Dry; lacks texture', 'herbs', 2],
    ['onion', 'scallions', 1, '1:1', 'Milder; works raw and cooked', 'herbs', 3],

    ['chili flakes', 'cayenne pepper', 0.5, '1/2 amount', 'Finer grind; consistent heat', 'herbs', 0],
    ['chili flakes', 'fresh chili minced', 1, '1 small chili per tsp flakes', 'Fresher taste; adjust to heat preference', 'herbs', 1],
    ['chili flakes', 'gochugaru', 1, '1:1', 'Korean chili flakes; fruity, less sharp heat', 'herbs', 2],

    ['lemongrass', 'lemon zest', 0.5, '1 tsp zest per stalk', 'Adds citrus; lacks the herbal complexity', 'herbs', 0],
    ['lemongrass', 'lemon verbena', 1, '1:1', 'Similar citrusy flavor; great in teas and desserts', 'herbs', 1],
    ['lemongrass', 'ginger + lemon zest', 1, '1 tsp each per stalk', 'Approximates the citrus-spicy profile', 'herbs', 2],

    ['thai basil', 'sweet basil + pinch anise', 1, '1:1 basil + small pinch anise', 'Approximates the licorice notes', 'herbs', 0],
    ['thai basil', 'holy basil', 1, '1:1', 'Spicier; traditional in Thai stir-fries', 'herbs', 1],

    ['kaffir lime leaves', 'lime zest', 0.5, '1 tsp zest per leaf', 'Misses the floral complexity; adds citrus', 'herbs', 0],
    ['kaffir lime leaves', 'bay leaf + lime zest', 1, '1 bay leaf + 1 tsp zest per kaffir leaf', 'Better approximation of the aromatic profile', 'herbs', 1],

    ['star anise', 'chinese five-spice', 0.25, '1/4 tsp per whole star', 'Blend contains star anise; adds other flavors', 'herbs', 0],
    ['star anise', 'fennel seeds', 1, '1 tsp per whole star', 'Milder anise flavor; works in braising', 'herbs', 1],
    ['star anise', 'anise seed', 0.5, '1/2 tsp per whole star', 'Concentrated anise flavor', 'herbs', 2],

    ['tamarind paste', 'lime juice + brown sugar', 1, '1 tbsp lime + 1 tsp sugar per tbsp paste', 'Approximates sour-sweet; different flavor depth', 'herbs', 0],
    ['tamarind paste', 'pomegranate molasses', 1, '1:1', 'Tart and sweet; works in curries and chutneys', 'herbs', 1],
    ['tamarind paste', 'rice vinegar + brown sugar', 1, '2 tsp vinegar + 1 tsp sugar per tbsp paste', 'Simpler; works for marinades', 'herbs', 2],

    // ──────────────── PROTEINS ────────────────
    ['chicken breast', 'turkey breast', 1, '1:1', 'Leaner; very similar flavor', 'proteins', 0],
    ['chicken breast', 'pork tenderloin', 1, '1:1', 'Similar texture; slightly sweeter', 'proteins', 1],
    ['chicken breast', 'firm tofu', 1, '1:1', 'Vegan; press and marinate for best results', 'proteins', 2],
    ['chicken breast', 'tempeh', 1, '1:1', 'Vegan; nutty flavor; good texture', 'proteins', 3],
    ['chicken breast', 'seitan', 1, '1:1', 'Wheat gluten; most meat-like texture', 'proteins', 4],

    ['ground beef', 'ground turkey', 1, '1:1', 'Leaner; milder flavor', 'proteins', 0],
    ['ground beef', 'ground pork', 1, '1:1', 'Fattier; sweeter', 'proteins', 1],
    ['ground beef', 'plant-based ground', 1, '1:1', 'Beyond/Impossible; cooks similarly', 'proteins', 2],
    ['ground beef', 'lentils cooked', 1, '1:1', 'Vegan; great in tacos and bolognese', 'proteins', 3],
    ['ground beef', 'mushrooms finely chopped', 1, '1:1', 'Meaty umami; best as partial substitute', 'proteins', 4],

    ['bacon', 'turkey bacon', 1, '1:1', 'Leaner; less smoky', 'proteins', 0],
    ['bacon', 'tempeh bacon', 1, '1:1 (slice thin, marinate)', 'Vegan; smoky marinade needed', 'proteins', 1],
    ['bacon', 'coconut bacon', 1, '1:1', 'Vegan; crispy and smoky', 'proteins', 2],
    ['bacon', 'prosciutto', 0.5, '1/2 amount', 'Less smoky; saltier', 'proteins', 3],
    ['bacon', 'smoked paprika + olive oil', 0.5, 'for flavor only', 'Adds smokiness to dishes; no protein', 'proteins', 4],

    ['salmon', 'trout', 1, '1:1', 'Similar texture and flavor', 'proteins', 0],
    ['salmon', 'arctic char', 1, '1:1', 'Milder; beautiful pink color', 'proteins', 1],
    ['salmon', 'tuna steak', 1, '1:1', 'Firmer; meatier', 'proteins', 2],

    ['shrimp', 'langoustine', 1, '1:1', 'Sweeter; more delicate', 'proteins', 0],
    ['shrimp', 'hearts of palm', 1, '1:1', 'Vegan; similar texture when chopped', 'proteins', 1],
    ['shrimp', 'king oyster mushroom', 1, '1:1 (score and sear)', 'Vegan; excellent texture mimic', 'proteins', 2],

    ['tofu', 'tempeh', 1, '1:1', 'Firmer; nuttier; fermented', 'proteins', 0],
    ['tofu', 'paneer', 1, '1:1', 'Indian cheese; similar firmness', 'proteins', 1],
    ['tofu', 'seitan', 1, '1:1', 'Chewier; more protein', 'proteins', 2],
    ['tofu', 'chickpeas', 1, '1:1', 'Different texture; similar protein', 'proteins', 3],

    ['chicken thigh', 'chicken breast', 1, '1:1', 'Leaner; less juicy; reduce cook time slightly', 'proteins', 0],
    ['chicken thigh', 'turkey thigh', 1, '1:1', 'Similar fat content; milder flavor', 'proteins', 1],
    ['chicken thigh', 'pork shoulder (cubed)', 1, '1:1', 'Rich and tender; works in braised dishes', 'proteins', 2],

    ['ground turkey', 'ground chicken', 1, '1:1', 'Very similar; slightly milder', 'proteins', 0],
    ['ground turkey', 'ground pork', 1, '1:1', 'Fattier; more flavor', 'proteins', 1],
    ['ground turkey', 'plant-based ground', 1, '1:1', 'Vegan; cooks similarly', 'proteins', 2],

    ['canned tuna', 'canned salmon', 1, '1:1', 'Richer; works in salads and patties', 'proteins', 0],
    ['canned tuna', 'canned chickpeas mashed', 1, '1:1', 'Vegan "tuna" salad; add kelp for seafood flavor', 'proteins', 1],
    ['canned tuna', 'canned sardines', 1, '1:1', 'Stronger flavor; higher omega-3', 'proteins', 2],

    ['sausage', 'ground pork + spices', 1, '1 lb pork + 1 tsp sage + 1/2 tsp each thyme, pepper, red pepper flakes', 'Homemade breakfast sausage; adjust spices to taste', 'proteins', 0],
    ['sausage', 'ground turkey + spices', 1, 'Same spice blend with ground turkey', 'Leaner; works for breakfast sausage', 'proteins', 1],
    ['sausage', 'plant-based sausage', 1, '1:1', 'Vegan; check brand for best cooking results', 'proteins', 2],

    ['lamb', 'beef', 1, '1:1', 'Less gamey; works in stews and roasts', 'proteins', 0],
    ['lamb', 'goat', 1, '1:1', 'Similar gamey flavor; leaner', 'proteins', 1],
    ['lamb', 'mushroom + lentil mix', 1, '1:1', 'Vegan; hearty substitute for ground lamb', 'proteins', 2],

    ['ham', 'turkey ham', 1, '1:1', 'Leaner; milder; works in sandwiches', 'proteins', 0],
    ['ham', 'prosciutto', 0.5, '1/2 amount', 'More intense; use less', 'proteins', 1],
    ['ham', 'canadian bacon', 1, '1:1', 'Leaner; similar smoky flavor', 'proteins', 2],

    // ──────────────── PRODUCE ────────────────
    ['lemon juice', 'lime juice', 1, '1:1', 'Slightly different citrus profile', 'produce', 0],
    ['lemon juice', 'white wine vinegar', 0.5, '1/2 amount', 'More acidic; no citrus flavor', 'produce', 1],
    ['lemon juice', 'orange juice', 2, '2x amount', 'Sweeter; less tart', 'produce', 2],

    ['lime juice', 'lemon juice', 1, '1:1', 'Less floral; works in most contexts', 'produce', 0],
    ['lime juice', 'white wine vinegar', 0.5, '1/2 amount', 'For acidity only; no citrus', 'produce', 1],

    ['avocado', 'hummus', 1, '1:1', 'As spread; different flavor', 'produce', 0],
    ['avocado', 'mashed banana', 1, '1:1 (in baking)', 'Sweet; adds moisture in baking', 'produce', 1],
    ['avocado', 'edamame puree', 1, '1:1', 'Green, creamy; high protein', 'produce', 2],

    ['tomato', 'roasted red pepper', 1, '1:1', 'Sweeter; similar color', 'produce', 0],
    ['tomato', 'canned tomato', 1, '1:1', 'Cooked flavor; works in sauces', 'produce', 1],

    ['spinach', 'kale', 1, '1:1 (chop fine)', 'Heartier; cook longer', 'produce', 0],
    ['spinach', 'swiss chard', 1, '1:1', 'Similar cook time; slight bitterness', 'produce', 1],
    ['spinach', 'arugula', 1, '1:1', 'Peppery; best used raw', 'produce', 2],

    ['potato', 'sweet potato', 1, '1:1', 'Sweeter; different texture when mashed', 'produce', 0],
    ['potato', 'cauliflower', 1, '1:1', 'Lower carb; works mashed or roasted', 'produce', 1],
    ['potato', 'turnip', 1, '1:1', 'Slightly peppery; lower carb', 'produce', 2],
    ['potato', 'parsnip', 1, '1:1', 'Sweeter; works roasted', 'produce', 3],

    ['sweet potato', 'butternut squash', 1, '1:1', 'Similar sweetness and texture', 'produce', 0],
    ['sweet potato', 'carrot', 1, '1:1', 'Sweeter; works roasted or pureed', 'produce', 1],
    ['sweet potato', 'pumpkin', 1, '1:1', 'Similar flavor profile; slightly drier', 'produce', 2],

    ['mushroom', 'zucchini', 1, '1:1', 'Different flavor; similar volume', 'produce', 0],
    ['mushroom', 'eggplant', 1, '1:1', 'Meaty texture; absorbs flavors well', 'produce', 1],
    ['mushroom', 'sun-dried tomato', 0.5, '1/2 amount', 'For umami; chewy texture', 'produce', 2],

    ['bell pepper', 'poblano pepper', 1, '1:1', 'Mild heat; similar structure', 'produce', 0],
    ['bell pepper', 'anaheim pepper', 1, '1:1', 'Slight heat; similar texture', 'produce', 1],
    ['bell pepper', 'zucchini', 1, '1:1', 'For stir-fries; different flavor', 'produce', 2],

    ['broccoli', 'cauliflower', 1, '1:1', 'Milder; similar texture', 'produce', 0],
    ['broccoli', 'broccolini', 1, '1:1', 'More tender; slightly sweeter', 'produce', 1],
    ['broccoli', 'asparagus', 1, '1:1', 'Different shape; similar cook time', 'produce', 2],

    ['zucchini', 'yellow squash', 1, '1:1', 'Nearly identical; slightly sweeter', 'produce', 0],
    ['zucchini', 'cucumber', 1, '1:1 (raw only)', 'For salads; not for cooking', 'produce', 1],
    ['zucchini', 'eggplant', 1, '1:1', 'Meatier; absorbs more oil', 'produce', 2],

    ['celery', 'fennel', 1, '1:1', 'Anise flavor; similar crunch', 'produce', 0],
    ['celery', 'jicama', 1, '1:1', 'Crunchy; slightly sweet; works raw', 'produce', 1],
    ['celery', 'bok choy stalks', 1, '1:1', 'Mild; works in soups and stir-fries', 'produce', 2],

    ['carrot', 'parsnip', 1, '1:1', 'Sweeter; similar texture; great roasted', 'produce', 0],
    ['carrot', 'sweet potato', 1, '1:1', 'Sweeter; works in soups and purees', 'produce', 1],
    ['carrot', 'butternut squash', 1, '1:1', 'Similar sweetness; works roasted or in soups', 'produce', 2],

    ['cucumber', 'zucchini', 1, '1:1 (raw)', 'For salads; slightly different crunch', 'produce', 0],
    ['cucumber', 'jicama', 1, '1:1', 'Crunchy and refreshing; slightly sweet', 'produce', 1],
    ['cucumber', 'celery', 1, '1:1', 'For crunch in salads; different flavor', 'produce', 2],

    ['corn', 'peas', 1, '1:1', 'Sweet; similar size; works in most recipes', 'produce', 0],
    ['corn', 'edamame', 1, '1:1', 'Higher protein; works in salads and stir-fries', 'produce', 1],
    ['corn', 'diced bell pepper', 1, '1:1', 'Adds color and crunch; less sweet', 'produce', 2],

    ['green beans', 'asparagus', 1, '1:1', 'Similar shape and cook time', 'produce', 0],
    ['green beans', 'snap peas', 1, '1:1', 'Sweeter; works sauteed or steamed', 'produce', 1],
    ['green beans', 'broccolini', 1, '1:1', 'Similar cook time; different flavor', 'produce', 2],

    ['cabbage', 'bok choy', 1, '1:1', 'Milder; cooks faster', 'produce', 0],
    ['cabbage', 'brussels sprouts (halved)', 1, '1:1', 'Stronger flavor; similar family', 'produce', 1],
    ['cabbage', 'kale', 1, '1:1', 'Heartier; needs longer cook for tenderness', 'produce', 2],

    ['eggplant', 'zucchini', 1, '1:1', 'Lighter; similar shape for slicing', 'produce', 0],
    ['eggplant', 'portobello mushroom', 1, '1:1', 'Meaty; great grilled or roasted', 'produce', 1],
    ['eggplant', 'summer squash', 1, '1:1', 'Milder; works in ratatouille and stir-fries', 'produce', 2],

    ['cauliflower', 'broccoli', 1, '1:1', 'Stronger flavor; similar cook time', 'produce', 0],
    ['cauliflower', 'turnip', 1, '1:1', 'For mashing; slightly peppery', 'produce', 1],
    ['cauliflower', 'kohlrabi', 1, '1:1', 'Mild; works raw or cooked', 'produce', 2],

    ['lettuce', 'spinach', 1, '1:1', 'More nutritious; works in salads', 'produce', 0],
    ['lettuce', 'arugula', 1, '1:1', 'Peppery; adds character to salads', 'produce', 1],
    ['lettuce', 'endive', 1, '1:1', 'Slightly bitter; works as wrap or in salad', 'produce', 2],

    ['pumpkin puree', 'butternut squash puree', 1, '1:1', 'Very similar flavor and texture', 'produce', 0],
    ['pumpkin puree', 'sweet potato puree', 1, '1:1', 'Sweeter; works in pies and baking', 'produce', 1],
    ['pumpkin puree', 'carrot puree', 1, '1:1', 'Milder; lighter color; works in baking', 'produce', 2],

    ['scallions', 'chives', 0.5, '1/2 amount', 'Milder; works as garnish', 'produce', 0],
    ['scallions', 'leeks (green part)', 1, '1:1', 'Similar mild onion flavor', 'produce', 1],
    ['scallions', 'shallots', 0.5, '1/2 amount', 'Stronger; good cooked', 'produce', 2],

    ['jalapeno', 'serrano pepper', 1, '1:1 (hotter)', 'Similar size; 2-3x hotter; use less if needed', 'produce', 0],
    ['jalapeno', 'fresno pepper', 1, '1:1', 'Similar heat; slightly fruitier', 'produce', 1],
    ['jalapeno', 'poblano pepper', 2, '2 poblanos per jalapeno', 'Much milder; use more for similar volume', 'produce', 2],
    ['jalapeno', 'cayenne pepper', 0.1, '1/8 tsp per jalapeno', 'Dry heat; for spice without fresh pepper texture', 'produce', 3],

    // ──────────────── LEGUMES ────────────────
    ['chickpeas', 'white beans', 1, '1:1', 'Similar texture; milder flavor', 'legumes', 0],
    ['chickpeas', 'lentils', 1, '1:1', 'Softer; cooks faster; works in curries', 'legumes', 1],
    ['chickpeas', 'edamame', 1, '1:1', 'Higher protein; works in salads', 'legumes', 2],

    ['black beans', 'kidney beans', 1, '1:1', 'Larger; similar earthiness', 'legumes', 0],
    ['black beans', 'pinto beans', 1, '1:1', 'Creamier when mashed; works in burritos', 'legumes', 1],
    ['black beans', 'lentils', 1, '1:1', 'Smaller; faster cook; works in tacos', 'legumes', 2],

    ['kidney beans', 'pinto beans', 1, '1:1', 'Creamier; works in chili and stews', 'legumes', 0],
    ['kidney beans', 'black beans', 1, '1:1', 'Smaller; earthier; works in chili', 'legumes', 1],
    ['kidney beans', 'cannellini beans', 1, '1:1', 'Milder; creamier; Italian style', 'legumes', 2],

    ['lentils', 'split peas', 1, '1:1', 'Similar cook time; similar use in soups', 'legumes', 0],
    ['lentils', 'mung beans', 1, '1:1', 'Smaller; cook faster; work in Indian dishes', 'legumes', 1],
    ['lentils', 'chickpeas', 1, '1:1', 'Firmer; hold shape better', 'legumes', 2],

    ['split peas', 'red lentils', 1, '1:1', 'Cook to similar soft consistency; great for soups', 'legumes', 0],
    ['split peas', 'yellow lentils (moong dal)', 1, '1:1', 'Indian cooking; similar texture when cooked', 'legumes', 1],

    // ──────────────── GRAINS & STARCHES ────────────────
    ['white rice', 'brown rice', 1, '1:1 (increase cook time)', 'Nuttier; more fiber; longer cook', 'grains', 0],
    ['white rice', 'quinoa', 1, '1:1', 'More protein; slightly crunchy', 'grains', 1],
    ['white rice', 'cauliflower rice', 1, '1:1', 'Low carb; pulse cauliflower in food processor', 'grains', 2],
    ['white rice', 'couscous', 1, '1:1', 'Faster cooking; smaller grains', 'grains', 3],
    ['white rice', 'orzo', 1, '1:1', 'Pasta shape; different texture', 'grains', 4],

    ['pasta', 'zucchini noodles', 1, '1:1', 'Low carb; raw or briefly sauteed', 'grains', 0],
    ['pasta', 'rice noodles', 1, '1:1', 'Gluten-free; different chew', 'grains', 1],
    ['pasta', 'spaghetti squash', 1, '1:1', 'Low carb; unique texture', 'grains', 2],
    ['pasta', 'sweet potato noodles', 1, '1:1', 'Chewy; gluten-free (Korean glass noodles)', 'grains', 3],
    ['pasta', 'chickpea pasta', 1, '1:1', 'High protein; similar texture', 'grains', 4],

    ['breadcrumbs', 'panko', 1, '1:1', 'Crispier; Japanese-style', 'grains', 0],
    ['breadcrumbs', 'crushed crackers', 1, '1:1', 'Adds flavor; works for breading', 'grains', 1],
    ['breadcrumbs', 'ground oats', 1, '1:1', 'Gluten-free (if certified); softer', 'grains', 2],
    ['breadcrumbs', 'crushed cornflakes', 1, '1:1', 'Extra crispy coating', 'grains', 3],
    ['breadcrumbs', 'almond meal', 1, '1:1', 'Low carb; nutty flavor', 'grains', 4],

    ['couscous', 'quinoa', 1, '1:1', 'More protein; slightly different texture', 'grains', 0],
    ['couscous', 'orzo', 1, '1:1', 'Pasta; similar shape', 'grains', 1],
    ['couscous', 'bulgur wheat', 1, '1:1', 'Nuttier; more fiber', 'grains', 2],

    ['tortilla', 'lettuce wrap', 1, '1:1', 'Low carb; fresh crunch', 'grains', 0],
    ['tortilla', 'rice paper', 1, '1:1', 'Gluten-free; translucent', 'grains', 1],
    ['tortilla', 'naan bread', 0.5, '1 naan per 2 tortillas', 'Thicker; great for wraps', 'grains', 2],
    ['tortilla', 'collard green leaf', 1, '1:1', 'Sturdy leaf; low carb wrap', 'grains', 3],

    ['bread', 'tortilla', 1, '1:1', 'For sandwiches/wraps; different texture', 'grains', 0],
    ['bread', 'lettuce wrap', 1, '1:1', 'Low carb; fresh and crunchy', 'grains', 1],
    ['bread', 'rice cake', 1, '1:1', 'Gluten-free; lighter; works for open-face', 'grains', 2],

    ['oats', 'quinoa flakes', 1, '1:1', 'Gluten-free; cooks faster; similar use in porridge', 'grains', 0],
    ['oats', 'buckwheat groats', 1, '1:1', 'Gluten-free; nuttier; heartier texture', 'grains', 1],
    ['oats', 'amaranth', 1, '1:1', 'Tiny grain; porridge-like when cooked', 'grains', 2],

    ['brown rice', 'farro', 1, '1:1', 'Nutty; chewy; similar cook time', 'grains', 0],
    ['brown rice', 'barley', 1, '1:1', 'Chewy; nutty; high fiber', 'grains', 1],
    ['brown rice', 'wild rice', 1, '1:1', 'Nuttier; longer cook time; dramatic presentation', 'grains', 2],

    ['crackers', 'rice cakes', 1, '1:1', 'Gluten-free; lighter; works for dipping', 'grains', 0],
    ['crackers', 'melba toast', 1, '1:1', 'Thin and crispy; works with cheese and spreads', 'grains', 1],
    ['crackers', 'cucumber slices', 1, '1:1', 'Low carb; refreshing base for toppings', 'grains', 2],

    // ──────────────── BAKING ────────────────
    ['baking powder', 'baking soda + cream of tartar', 1, '1/4 tsp soda + 1/2 tsp cream of tartar per tsp', 'Homemade single-acting baking powder', 'baking', 0],
    ['baking powder', 'self-rising flour (replace AP flour)', 1, 'Use self-rising flour, omit baking powder', 'Flour already contains leavening', 'baking', 1],

    ['baking soda', 'baking powder', 3, '3 tsp per 1 tsp soda', 'Less powerful; may need to adjust acid in recipe', 'baking', 0],
    ['baking soda', 'potassium bicarbonate', 1, '1:1', 'Sodium-free; same leavening power', 'baking', 1],

    ['vanilla extract', 'vanilla bean paste', 1, '1:1', 'More flavor; visible seeds', 'baking', 0],
    ['vanilla extract', 'vanilla bean', 1, '1 bean per 1 tbsp extract', 'Premium flavor; scrape seeds', 'baking', 1],
    ['vanilla extract', 'almond extract', 0.5, '1/2 amount', 'Different flavor; pairs well with cherry', 'baking', 2],
    ['vanilla extract', 'maple syrup', 1, '1:1', 'Adds sweetness; warm flavor', 'baking', 3],

    ['cocoa powder', 'cacao powder', 1, '1:1', 'Less processed; more bitter', 'baking', 0],
    ['cocoa powder', 'carob powder', 1, '1:1', 'Naturally sweeter; caffeine-free', 'baking', 1],
    ['cocoa powder', 'chocolate chips melted', 3, '3 tbsp chips per 1 tbsp cocoa', 'Adds fat and sugar; reduce both in recipe', 'baking', 2],

    ['chocolate chips', 'chopped chocolate bar', 1, '1:1', 'More rustic; different melt pattern', 'baking', 0],
    ['chocolate chips', 'cacao nibs', 1, '1:1', 'No sugar; intense chocolate; crunchy', 'baking', 1],
    ['chocolate chips', 'carob chips', 1, '1:1', 'Naturally sweeter; caffeine-free', 'baking', 2],

    ['cream of tartar', 'lemon juice', 2, '2x amount', 'Acidic; for egg whites use 1/2 tsp per white', 'baking', 0],
    ['cream of tartar', 'white vinegar', 2, '2x amount', 'Stabilizes egg whites; no flavor impact', 'baking', 1],

    ['gelatin', 'agar agar', 0.5, '1/2 amount (stronger)', 'Vegan; sets firmer; does not melt in mouth the same', 'baking', 0],
    ['gelatin', 'pectin', 1, '1:1 (for jams)', 'Vegan; needs acid and sugar to set', 'baking', 1],

    ['yeast', 'baking powder', 1, '1 tsp per tsp yeast', 'Quick bread instead of yeast bread; no rise time', 'baking', 0],
    ['yeast', 'sourdough starter', 1, '1 cup starter per 2 tsp yeast', 'Longer rise; complex flavor; reduce flour and liquid each by 1/2 cup', 'baking', 1],
    ['yeast', 'self-rising flour (replace AP flour)', 1, 'Use self-rising flour, omit yeast', 'Quick bread; no rise time needed', 'baking', 2],

    // ──────────────── NUTS & SEEDS ────────────────
    ['almonds', 'cashews', 1, '1:1', 'Softer; creamier', 'nuts', 0],
    ['almonds', 'sunflower seeds', 1, '1:1', 'Nut-free; slightly different flavor', 'nuts', 1],
    ['almonds', 'pecans', 1, '1:1', 'Sweeter; softer texture', 'nuts', 2],
    ['almonds', 'hazelnuts', 1, '1:1', 'Richer; pairs well with chocolate', 'nuts', 3],

    ['peanuts', 'almonds', 1, '1:1', 'Tree nut; similar crunch', 'nuts', 0],
    ['peanuts', 'sunflower seeds', 1, '1:1', 'Nut-free; similar texture', 'nuts', 1],
    ['peanuts', 'soy nuts', 1, '1:1', 'Legume-based; similar crunch', 'nuts', 2],

    ['peanut butter', 'almond butter', 1, '1:1', 'Milder; similar texture', 'nuts', 0],
    ['peanut butter', 'sunflower seed butter', 1, '1:1', 'Nut-free; similar consistency', 'nuts', 1],
    ['peanut butter', 'tahini', 1, '1:1', 'Sesame-based; more bitter', 'nuts', 2],
    ['peanut butter', 'cashew butter', 1, '1:1', 'Creamier; milder', 'nuts', 3],
    ['peanut butter', 'soy nut butter', 1, '1:1', 'Nut-free; similar protein', 'nuts', 4],

    ['walnuts', 'pecans', 1, '1:1', 'Sweeter; less bitter', 'nuts', 0],
    ['walnuts', 'almonds', 1, '1:1', 'Crunchier; milder', 'nuts', 1],
    ['walnuts', 'sunflower seeds', 1, '1:1', 'Nut-free; smaller', 'nuts', 2],

    ['pine nuts', 'sunflower seeds', 1, '1:1', 'Cheaper; similar use in pesto', 'nuts', 0],
    ['pine nuts', 'cashews', 1, '1:1', 'Creamy; works in pesto', 'nuts', 1],
    ['pine nuts', 'almonds blanched', 1, '1:1', 'Mild; toast before using', 'nuts', 2],
    ['pine nuts', 'hemp seeds', 1, '1:1', 'Soft; nutty; nut-free', 'nuts', 3],

    ['tahini', 'sunflower seed butter', 1, '1:1', 'Nut-free; similar consistency', 'nuts', 0],
    ['tahini', 'cashew butter', 1, '1:1', 'Creamier; milder', 'nuts', 1],
    ['tahini', 'peanut butter', 1, '1:1', 'Stronger flavor; works in dressings', 'nuts', 2],

    ['chia seeds', 'flax seeds ground', 1, '1:1', 'Similar binding; omega-3 rich', 'nuts', 0],
    ['chia seeds', 'hemp seeds', 1, '1:1', 'More protein; no gel formation', 'nuts', 1],
    ['chia seeds', 'psyllium husk', 0.5, '1/2 amount', 'Strong binder; very absorbent', 'nuts', 2],

    ['flax seeds', 'chia seeds', 1, '1:1', 'Similar nutrition; gel when soaked', 'nuts', 0],
    ['flax seeds', 'hemp seeds', 1, '1:1', 'More protein; no binding ability', 'nuts', 1],

    // ──────────────── ALCOHOL ────────────────
    ['white wine', 'chicken broth + white wine vinegar', 1, '1 cup broth + 1 tbsp vinegar', 'Adds acidity without alcohol', 'alcohol', 0],
    ['white wine', 'apple juice + vinegar', 1, '1:1 juice + splash vinegar', 'Sweet and acidic; works in sauces', 'alcohol', 1],
    ['white wine', 'dry vermouth', 1, '1:1', 'Herbaceous; lasts longer once opened', 'alcohol', 2],

    ['red wine', 'beef broth + red wine vinegar', 1, '1 cup broth + 1 tbsp vinegar', 'Rich depth without alcohol', 'alcohol', 0],
    ['red wine', 'grape juice + vinegar', 1, '1:1 juice + splash vinegar', 'Fruity; adds color', 'alcohol', 1],
    ['red wine', 'pomegranate juice', 1, '1:1', 'Tart and deep; great for braising', 'alcohol', 2],

    ['beer', 'chicken broth', 1, '1:1', 'Similar liquid volume; less depth', 'alcohol', 0],
    ['beer', 'non-alcoholic beer', 1, '1:1', 'Closest match; maintains flavor', 'alcohol', 1],
    ['beer', 'ginger ale', 1, '1:1', 'For batters; adds sweetness and fizz', 'alcohol', 2],

    ['rum', 'rum extract + water', 1, '1 tsp extract + enough water for volume', 'Non-alcoholic; concentrated flavor', 'alcohol', 0],
    ['rum', 'vanilla extract', 0.5, '1/2 amount', 'Warm, sweet flavor; for baking', 'alcohol', 1],

    ['bourbon', 'vanilla extract', 0.5, '1/2 amount', 'Warm, sweet; for desserts', 'alcohol', 0],
    ['bourbon', 'apple juice + almond extract', 1, '1:1 juice + few drops extract', 'Non-alcoholic; smoky-sweet', 'alcohol', 1],

    ['brandy', 'apple juice concentrate', 1, '1:1', 'Sweet; fruity', 'alcohol', 0],
    ['brandy', 'vanilla extract + grape juice', 1, '1/2 tsp extract + juice for volume', 'Non-alcoholic; for desserts', 'alcohol', 1],

    ['kahlua', 'espresso + sugar', 1, '1:1 (strong coffee + 1 tbsp sugar)', 'Coffee flavor without alcohol', 'alcohol', 0],

    ['marsala wine', 'grape juice + brandy extract', 1, '1:1', 'Non-alcoholic; for chicken marsala', 'alcohol', 0],
    ['marsala wine', 'madeira wine', 1, '1:1', 'Very similar fortified wine', 'alcohol', 1],

    ['mirin', 'rice vinegar + sugar', 1, '1 tbsp vinegar + 1/2 tsp sugar per tbsp', 'Non-alcoholic; sweet-tangy', 'alcohol', 0],
    ['mirin', 'dry sherry', 1, '1:1 + pinch sugar', 'Similar sweetness level', 'alcohol', 1],

    ['sake', 'dry white wine', 1, '1:1', 'Lighter; works in Japanese cooking', 'alcohol', 0],
    ['sake', 'rice wine vinegar + water', 1, '1 tsp vinegar + rest water', 'Non-alcoholic; slight tang', 'alcohol', 1],

    // ──────────────── MISC ────────────────
    ['broth', 'bouillon cube + water', 1, '1 cube per cup water', 'Saltier; adjust seasoning', 'misc', 0],
    ['broth', 'miso paste + water', 1, '1 tbsp miso per cup water', 'Umami-rich; adds fermented depth', 'misc', 1],
    ['broth', 'mushroom soaking liquid', 1, '1:1', 'Deep umami; from dried mushrooms', 'misc', 2],
    ['broth', 'vegetable scraps simmered', 1, '1:1', 'Homemade; use onion, carrot, celery', 'misc', 3],

    ['chicken broth', 'vegetable broth', 1, '1:1', 'Lighter; vegetarian-friendly', 'misc', 0],
    ['chicken broth', 'mushroom broth', 1, '1:1', 'Deep umami; heartier', 'misc', 1],
    ['chicken broth', 'bouillon paste + water', 1, '1 tsp per cup', 'Convenient; watch sodium', 'misc', 2],

    ['beef broth', 'mushroom broth', 1, '1:1', 'Rich umami; vegetarian', 'misc', 0],
    ['beef broth', 'soy sauce + water', 1, '1 tbsp soy + 1 cup water', 'Adds color and umami', 'misc', 1],

    ['coconut milk', 'oat cream', 1, '1:1', 'Neutral; less rich', 'misc', 0],
    ['coconut milk', 'cashew cream', 1, '1:1', 'Very creamy; neutral flavor', 'misc', 1],
    ['coconut milk', 'heavy cream', 1, '1:1', 'Dairy; similar richness', 'misc', 2],
    ['coconut milk', 'almond milk + coconut extract', 1, '1:1 + few drops extract', 'Thinner; maintains coconut flavor', 'misc', 3],

    ['saffron', 'turmeric', 0.5, '1/2 tsp per pinch saffron', 'Color only; completely different flavor', 'misc', 0],
    ['saffron', 'safflower', 1, '1:1', 'Color substitute; mild flavor', 'misc', 1],
    ['saffron', 'annatto', 0.5, '1/2 amount', 'Golden color; earthy flavor', 'misc', 2],

    ['anchovy', 'capers + soy sauce', 1, '1 tsp capers + 1/2 tsp soy per anchovy', 'Salty, briny, umami without fish', 'misc', 0],
    ['anchovy', 'miso paste', 1, '1 tsp per anchovy', 'Umami-rich; vegan', 'misc', 1],
    ['anchovy', 'worcestershire sauce', 1, '1 tsp per anchovy', 'Contains anchovy; liquid form', 'misc', 2],

    ['capers', 'green olives chopped', 1, '1:1', 'Briny; similar tang', 'misc', 0],
    ['capers', 'pickled nasturtium seeds', 1, '1:1', 'Traditional substitute; very similar', 'misc', 1],
    ['capers', 'dill pickle relish', 1, '1:1', 'Tangy; different texture', 'misc', 2],

    ['cornmeal', 'polenta', 1, '1:1', 'Same thing, different grind; check coarseness', 'misc', 0],
    ['cornmeal', 'grits', 1, '1:1', 'Coarser; Southern style', 'misc', 1],
    ['cornmeal', 'semolina', 1, '1:1', 'Wheat-based; similar texture for dusting', 'misc', 2],

    ['panko', 'breadcrumbs toasted', 1, '1:1', 'Less airy; toast for crispiness', 'misc', 0],
    ['panko', 'crushed pork rinds', 1, '1:1', 'Low carb; extra crispy', 'misc', 1],
    ['panko', 'cornflake crumbs', 1, '1:1', 'Extra crunchy coating', 'misc', 2],

    ['miso paste', 'soy sauce', 0.5, '1/2 tbsp per tbsp miso', 'Thinner; salty umami only', 'misc', 0],
    ['miso paste', 'tahini + soy sauce', 1, '1:1 (mix half tahini, half soy)', 'Adds body and umami', 'misc', 1],

    ['sriracha', 'sambal oelek', 1, '1:1', 'Pure chili; no garlic or sugar', 'misc', 0],
    ['sriracha', 'gochujang', 0.5, '1/2 amount (thicker)', 'Korean chili paste; fermented, sweeter', 'misc', 1],
    ['sriracha', 'hot sauce + garlic', 1, '1:1 hot sauce + pinch garlic', 'Approximates the garlic-chili balance', 'misc', 2],

    ['hoisin sauce', 'peanut butter + soy sauce + honey', 1, '1 tbsp each per 2 tbsp hoisin', 'Homemade approximation', 'misc', 0],
    ['hoisin sauce', 'bbq sauce + soy sauce', 1, '1:1 mix', 'Western alternative; similar sweet-savory', 'misc', 1],

    ['oyster sauce', 'hoisin sauce', 1, '1:1', 'Different flavor; similar consistency', 'misc', 0],
    ['oyster sauce', 'soy sauce + sugar', 1, '1 tbsp soy + 1/2 tsp sugar per tbsp', 'Simpler; lacks depth', 'misc', 1],
    ['oyster sauce', 'mushroom sauce', 1, '1:1', 'Vegetarian oyster sauce alternative', 'misc', 2],

    ['gochujang', 'sriracha + miso', 1, '1:1 mix', 'Approximates the fermented chili flavor', 'misc', 0],
    ['gochujang', 'sambal oelek + sugar', 1, '1:1 sambal + 1 tsp sugar', 'Simpler; less complex', 'misc', 1],

    ['curry paste', 'curry powder + oil + garlic + ginger', 1, '2 tsp powder + 1 tsp oil + aromatics per tbsp paste', 'Drier; less complex but functional', 'misc', 0],

    ['harissa', 'sriracha + cumin + coriander', 1, '1:1 sriracha + pinch each spice', 'Approximates the heat and spice blend', 'misc', 0],
    ['harissa', 'gochujang + smoked paprika', 1, '1:1 gochujang + 1/2 tsp paprika', 'Smoky, spicy; different origin, similar use', 'misc', 1],

    ['coconut cream', 'heavy cream', 1, '1:1', 'Dairy; same richness', 'misc', 0],
    ['coconut cream', 'cashew cream', 1, '1:1 (blend soaked cashews)', 'Vegan; neutral flavor', 'misc', 1],

    ['condensed milk', 'coconut condensed milk', 1, '1:1', 'Vegan; slight coconut flavor', 'misc', 0],
    ['condensed milk', 'evaporated milk + sugar', 1, '1 cup evap + 1 1/4 cup sugar, simmer', 'Homemade; takes time', 'misc', 1],

    ['evaporated milk', 'heavy cream', 1, '1:1', 'Richer; not reduced', 'misc', 0],
    ['evaporated milk', 'coconut milk', 1, '1:1', 'Vegan; slight coconut flavor', 'misc', 1],
    ['evaporated milk', 'regular milk simmered', 1, 'Simmer 2 cups to 1 cup', 'Homemade; reduce by half', 'misc', 2],
  ];

  const insertMany = db.transaction((items: SubstitutionSeed[]) => {
    for (const r of items) {
      insert.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6]);
    }
  });

  insertMany(rows);
  console.log(`  Seeded ${rows.length} substitution mappings across 16 categories.`);
}
