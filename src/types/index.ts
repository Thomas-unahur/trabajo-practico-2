export interface User {
  id: string;
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
  id: string;
  idPost: string;
  imageUrl: string;
}

export interface Post {
  id: string;
  userId: number | string;
  description: string;
  tags: Tag[];
  imagen: PostImage[];
  Comments?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: number | string;
  content: string;
  userId?: number | string;
  postId?: number | string;
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