import type { Recipe } from './index';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type RecipesStackParamList = {
  RecipeList: undefined;
  RecipeDetail: { id: number };
  RecipeForm: { recipe?: Recipe } | undefined;
};

export type BottomTabParamList = {
  Recipes: undefined;
  Stats: undefined;
  Profile: undefined;
};
