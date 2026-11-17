export interface User {
  id: number | string;
  nickName: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface PostImage {
  id: number | string;
  idPost?: number | string;
  PostId?: number | string;
  imageUrl?: string;
  url?: string;
}

export interface Post {
  id: number | string;
  userId: number | string;
  UserId?: number | string;
  User?: User;
  description: string;
  tags: Tag[];
  Tags?: Tag[];
  imagen: PostImage[];
  PostImages?: PostImage[];
  Comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: number | string;
  content: string;
  userId?: number | string;
  UserId?: number | string;
  postId?: number | string;
  PostId?: number | string;
  idUser?: User | number | string;
  idPost?: number | string;
  visible?: boolean;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}
export interface CreateCommentData {
  content: string;
  userId: number;
  postId: number;
}