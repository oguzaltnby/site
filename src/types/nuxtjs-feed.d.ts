declare module "@nuxtjs/feed" {
  export interface FeedOptions {
    path: string;
    type: string;
    create: (feed: any) => void;
  }
}
