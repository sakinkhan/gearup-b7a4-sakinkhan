export interface ICreateCategoryPayload {
  name: string;
  description?: string;
  image?: string;
}

export interface IUpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: string;
}
