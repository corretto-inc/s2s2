import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '사이사이 고객센터',
  tagline: '우리 사이의 모든 순간',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://cs.s2s2.kr',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // Make GitHub Pages redirects consistent
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/pretendard@latest/dist/web/static/pretendard.css',
      type: 'text/css',
    },
  ],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'corretto-inc', // Usually your GitHub org/user name.
  projectName: 's2s2', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: true,
        highlightSearchTermsOnTargetPage: true,
        language: ['en', 'ko'],
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    announcementBar: {
      id: 'data-safety',
      content:
        '사이사이는 사용자의 추억을 안전하게 보관합니다. 원본/리사이즈 이중화 저장 및 DB 일 1회 백업을 운영 중입니다.',
      backgroundColor: '#fde6ee',
      textColor: '#5b2b3a',
      isCloseable: true,
    },
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '사이사이 - 커플 앨범 공유앱',
      logo: {
        alt: '사이사이 Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Help',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/docs/help/backup-restore', label: '데이터 보관 정책', position: 'right'},
        {type: 'search', position: 'right'},
        // {
        //   href: 'https://github.com/facebook/docusaurus',
        //   label: 'GitHub',
        //   position: 'right',
        // },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '도움말',
          items: [
            {
              label: '도움말 센터',
              to: '/docs/help/getting-started',
            },
            {
              label: '블로그',
              to: '/blog',
            }
          ],
        },
        {
          title: '이용하기',
          items: [
            {
              label: 'App Store(IOS)',
              href: 'https://apps.apple.com/kr/app/%EC%82%AC%EC%9D%B4%EC%82%AC%EC%9D%B4-%EC%BB%A4%ED%94%8C-%EC%95%A8%EB%B2%94-%EA%B3%B5%EC%9C%A0/id6751275039',
            },
            {
              label: 'Google Play(Android)',
              href: 'https://play.google.com/store/apps/details?id=kr.s2s2',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: '사이사이 홈페이지',
              href: 'https://s2s2.kr',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Corretto, Inc.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
