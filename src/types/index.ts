export interface User {
  id: number;
  nickName: string;
  email?: string;
  createdAt?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number;
  url: string;
  postId: number;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt?: string;
  User?: User;
}

export interface Post {
  id: number;
  description: string;
  userId: number;
  createdAt?: string;
  User?: User;
  Tags?: Tag[];
  PostImages?: PostImage[];
  Comments?: Comment[];
}

