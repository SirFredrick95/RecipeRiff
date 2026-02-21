import { useState, useCallback } from 'react';
import client from '../api/client';
import type {
  RecipeListItem,
  Recipe,
  RecipeInput,
  FetchRecipesParams,
  UseRecipesReturn,
  RecipeListApiResponse,
  RecipeDetailApiResponse,
} from '../types';

export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const fetchRecipes = useCallback(async (fetchParams: FetchRecipesParams = {}): Promise<RecipeListItem[]> => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (fetchParams.search) params.search = fetchParams.search;
      if (fetchParams.tag && fetchParams.tag !== 'All') params.tag = fetchParams.tag;
      if (fetchParams.sort && fetchParams.sort !== 'default') params.sort = fetchParams.sort;
      params.page = fetchParams.page ?? 1;
      params.limit = fetchParams.limit ?? 50;

      const { data } = await client.get<RecipeListApiResponse>('/recipes', { params });
      setRecipes(data.recipes);
      setTotal(data.total);
      return data.recipes;
    } catch (err) {
      console.error('Fetch recipes error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecipe = useCallback(async (id: number): Promise<Recipe> => {
    const { data } = await client.get<RecipeDetailApiResponse>(`/recipes/${id}`);
    return data.recipe;
  }, []);

  const createRecipe = useCallback(async (recipe: RecipeInput): Promise<Recipe> => {
    const { data } = await client.post<RecipeDetailApiResponse>('/recipes', recipe);
    return data.recipe;
  }, []);

  const updateRecipe = useCallback(async (id: number, recipe: Partial<RecipeInput>): Promise<Recipe> => {
    const { data } = await client.put<RecipeDetailApiResponse>(`/recipes/${id}`, recipe);
    return data.recipe;
  }, []);

  const deleteRecipe = useCallback(async (id: number): Promise<void> => {
    await client.delete(`/recipes/${id}`);
  }, []);

  return { recipes, loading, total, fetchRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe };
}
