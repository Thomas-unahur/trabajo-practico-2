export interface User {
  id: string;
  nickName: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface PostImage {
  id: string;
  idPost: string;
  imageUrl: string;
}

export interface Post {
  id: string;
  idUser: User | string;
  description: string;
  tags: Tag[];
  imagen: PostImage[];
  Comments?: any[];
  createdAt?: string;
  updatedAt?: string;
}