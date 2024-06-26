import { Route } from '@/types';
import { getData, getList, getRedirectedLink } from './utils.js';

const variables = {
    period: 7,
    first: 15,
};

const query = `
  query MostUpvotedFeed(
    $first: Int
    $period: Int
    $supportedTypes: [String!] = ["article","share","freeform"]
  ) {
    page: mostUpvotedFeed(first: $first, period: $period, supportedTypes: $supportedTypes) {
      ...FeedPostConnection
    }
  }

  fragment FeedPostConnection on PostConnection {
    edges {
      node {
        ...FeedPost
      }
    }
  }

  fragment FeedPost on Post {
    ...SharedPostInfo
  }

  fragment SharedPostInfo on Post {
    id
    title
    image
    readTime
    permalink
    summary
    createdAt
    numUpvotes
    numComments
    author {
      ...UserShortInfo
    }
    tags
  }

  fragment UserShortInfo on User {
    id
    name
    image
    permalink
    username
    bio
  }

`;

const graphqlQuery = {
    query,
    variables,
};

export const route: Route = {
    path: '/upvoted',
    example: '/daily/upvoted',
    radar: [
        {
            source: ['daily.dev/popular'],
        },
    ],
    name: 'Most upvoted',
    maintainers: ['Rjnishant530'],
    handler,
    url: 'daily.dev/popular',
};

async function handler() {
    const baseUrl = 'https://app.daily.dev/upvoted';
    const data = await getData(graphqlQuery);
    const list = getList(data);
    const items = await getRedirectedLink(list);
    return {
        title: 'Most Upvoted',
        link: baseUrl,
        item: items,
        description: 'Most Upvoted Posts on Daily.dev',
        logo: 'https://app.daily.dev/favicon-32x32.png',
        icon: 'https://app.daily.dev/favicon-32x32.png',
        language: 'en-us',
    };
}
