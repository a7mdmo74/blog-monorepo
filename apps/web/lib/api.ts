import { graphqlClient } from "./graphql";
import { gql } from "graphql-request";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  createdAt: string;
  author: User;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  createdAt: string;
  author: User;
  category: Category | null;
  tags: Tag[];
}

export interface AuthPayload {
  token: string;
  user: User;
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const POST_FIELDS = gql`
  fragment PostFields on Post {
    id
    title
    slug
    content
    excerpt
    coverImage
    status
    createdAt
    author {
      id
      name
    }
    category {
      id
      name
      slug
    }
    tags {
      id
      name
      slug
    }
  }
`;

// ── Posts ──────────────────────────────────────────────

export async function getPublishedPosts(): Promise<Post[]> {
  const data = await graphqlClient.request<{ publishedPosts: Post[] }>(
    gql`
      ${POST_FIELDS}
      query GetPublishedPosts {
        publishedPosts {
          ...PostFields
        }
      }
    `,
  );
  return data.publishedPosts;
}

export async function getAllPosts(): Promise<Post[]> {
  const data = await graphqlClient.request<{ posts: Post[] }>(
    gql`
      ${POST_FIELDS}
      query GetAllPosts {
        posts {
          ...PostFields
        }
      }
    `,
  );
  return data.posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const data = await graphqlClient.request<{ postBySlug: Post | null }>(
    gql`
      ${POST_FIELDS}
      query GetPostBySlug($slug: String!) {
        postBySlug(slug: $slug) {
          ...PostFields
        }
      }
    `,
    { slug },
  );
  return data.postBySlug;
}

export async function getPostById(id: string): Promise<Post | null> {
  const data = await graphqlClient.request<{ post: Post | null }>(
    gql`
      ${POST_FIELDS}
      query GetPostById($id: ID!) {
        post(id: $id) {
          ...PostFields
        }
      }
    `,
    { id },
  );
  return data.post;
}

export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  const data = await graphqlClient.request<{ postsByAuthor: Post[] }>(
    gql`
      ${POST_FIELDS}
      query GetPostsByAuthor($authorId: ID!) {
        postsByAuthor(authorId: $authorId) {
          ...PostFields
        }
      }
    `,
    { authorId },
  );
  return data.postsByAuthor;
}

export async function createPost(
  token: string,
  input: {
    title: string;
    slug: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    status?: string;
    categoryId?: string;
    tagIds?: string[];
  },
): Promise<Post> {
  const data = await graphqlClient.request<{ createPost: Post }>(
    gql`
      ${POST_FIELDS}
      mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          ...PostFields
        }
      }
    `,
    { input },
    authHeaders(token),
  );
  return data.createPost;
}

export async function updatePost(
  token: string,
  id: string,
  input: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    status?: string;
    categoryId?: string;
    tagIds?: string[];
  },
): Promise<Post> {
  const data = await graphqlClient.request<{ updatePost: Post }>(
    gql`
      ${POST_FIELDS}
      mutation UpdatePost($id: ID!, $input: UpdatePostInput!) {
        updatePost(id: $id, input: $input) {
          ...PostFields
        }
      }
    `,
    { id, input },
    authHeaders(token),
  );
  return data.updatePost;
}

export async function deletePost(token: string, id: string): Promise<void> {
  await graphqlClient.request(
    gql`
      mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
          id
        }
      }
    `,
    { id },
    authHeaders(token),
  );
}

// ── Categories ─────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const data = await graphqlClient.request<{ categories: Category[] }>(
    gql`
      query GetCategories {
        categories {
          id
          name
          slug
        }
      }
    `,
  );
  return data.categories;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const data = await graphqlClient.request<{ categories: Category[] }>(
    gql`
      query GetCategories {
        categories {
          id
          name
          slug
        }
      }
    `,
  );
  return data.categories.find((c) => c.slug === slug) ?? null;
}

export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  const data = await graphqlClient.request<{ postsByCategory: Post[] }>(
    gql`
      ${POST_FIELDS}
      query GetPostsByCategory($categoryId: ID!) {
        postsByCategory(categoryId: $categoryId) {
          ...PostFields
        }
      }
    `,
    { categoryId },
  );
  return data.postsByCategory;
}

// ── Tags ───────────────────────────────────────────────

export async function getAllTags(): Promise<Tag[]> {
  const data = await graphqlClient.request<{ tags: Tag[] }>(
    gql`
      query GetTags {
        tags {
          id
          name
          slug
        }
      }
    `,
  );
  return data.tags;
}

// ── Comments ───────────────────────────────────────────

export async function getCommentsByPost(postId: string): Promise<Comment[]> {
  const data = await graphqlClient.request<{ comments: Comment[] }>(
    gql`
      query GetComments($postId: ID!) {
        comments(postId: $postId) {
          id
          content
          authorId
          postId
          parentId
          createdAt
          author {
            id
            name
          }
        }
      }
    `,
    { postId },
  );
  return data.comments;
}

export async function createComment(
  token: string,
  input: { content: string; postId: string; parentId?: string },
): Promise<Comment> {
  const data = await graphqlClient.request<{ createComment: Comment }>(
    gql`
      mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
          id
          content
          authorId
          postId
          parentId
          createdAt
          author {
            id
            name
          }
        }
      }
    `,
    { input },
    authHeaders(token),
  );
  return data.createComment;
}

export async function deleteComment(
  token: string,
  id: string,
): Promise<void> {
  await graphqlClient.request(
    gql`
      mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
          id
        }
      }
    `,
    { id },
    authHeaders(token),
  );
}

// ── Auth ───────────────────────────────────────────────

export async function getMe(token: string): Promise<User | null> {
  const data = await graphqlClient.request<{ me: User | null }>(
    gql`
      query Me {
        me {
          id
          name
          email
        }
      }
    `,
    {},
    authHeaders(token),
  );
  return data.me;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthPayload> {
  const data = await graphqlClient.request<{ login: AuthPayload }>(
    gql`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            name
            email
            role
          }
        }
      }
    `,
    { input: { email, password } },
  );
  return data.login;
}

export async function register(
  email: string,
  name: string,
  password: string,
): Promise<AuthPayload> {
  const data = await graphqlClient.request<{ register: AuthPayload }>(
    gql`
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            name
            email
            role
          }
        }
      }
    `,
    { input: { email, name, password } },
  );
  return data.register;
}

// ── Users ──────────────────────────────────────────────

export async function getUserById(id: string): Promise<User | null> {
  const data = await graphqlClient.request<{ user: User | null }>(
    gql`
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `,
    { id },
  );
  return data.user;
}

// ── Upload ─────────────────────────────────────────────

export interface UploadResult {
  id: string;
  url: string;
  publicId: string;
  filename: string;
  mimetype: string;
  bytes: number;
}

export async function uploadImage(
  token: string,
  file: File,
): Promise<UploadResult> {
  const base64 = await file.arrayBuffer().then((buf) => {
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  });

  const dataUri = `data:${file.type};base64,${base64}`;

  const data = await graphqlClient.request<{ uploadImage: UploadResult }>(
    gql`
      mutation UploadImage($file: String!, $filename: String, $folder: String) {
        uploadImage(file: $file, filename: $filename, folder: $folder) {
          id
          url
          publicId
          filename
          mimetype
          bytes
        }
      }
    `,
    { file: dataUri, filename: file.name, folder: "blog/covers" },
    authHeaders(token),
  );
  return data.uploadImage;
}
