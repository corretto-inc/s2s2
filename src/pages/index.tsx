import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">무엇을 도와드릴까요?</p>
        <span className={styles.heroBadge}>문의: help@corretto.io</span>
      </div>
    </header>
  );
}

type Topic = {
  title: string;
  description: string;
  to: string;
  emoji: string;
};

const topics: Topic[] = [
  {
    title: '시작하기',
    description: '회원가입부터 첫 앨범 생성까지 빠르게 안내합니다.',
    to: '/docs/help/getting-started',
    emoji: '🚀',
  },
  {
    title: '앨범 만들기',
    description: '새 커플 앨범 생성과 커버/설정 관리.',
    to: '/docs/help/create-album',
    emoji: '📚',
  },
  {
    title: '파트너 초대',
    description: '초대 코드로 안전하게 연결하세요.',
    to: '/docs/help/invite-partner',
    emoji: '💌',
  },
  {
    title: '사진/동영상 공유',
    description: '업로드와 댓글 사용법.',
    to: '/docs/help/share-album',
    emoji: '🖼️',
  },
  {
    title: '보안과 프라이버시',
    description: '접근 권한, 링크 보호, 비공개 옵션.',
    to: '/docs/help/privacy-security',
    emoji: '🔒',
  },
  {
    title: '백업과 복원',
    description: '내부 이중화·일일 DB 백업 정책 안내 (사용자 복원 미제공).',
    to: '/docs/help/backup-restore',
    emoji: '☁️',
  },
  {
    title: '요금제와 결제',
    description: '현재는 전 기능 무료 제공',
    to: '/docs/help/plans-billing',
    emoji: '💳',
  },
  {
    title: 'FAQ',
    description: '자주 묻는 질문과 빠른 해결 방법.',
    to: '/docs/help/faq',
    emoji: '❓',
  },
];

function SupportGrid() {
  return (
    <section className={styles.supportSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>도움말 주제</Heading>
        <div className={styles.supportGrid}>
          {topics.map((topic) => (
            <Link key={topic.title} to={topic.to} className={styles.supportCard}>
              <div className={styles.supportCardEmoji} aria-hidden>
                {topic.emoji}
              </div>
              <div className={styles.supportCardBody}>
                <h3 className={styles.supportCardTitle}>{topic.title}</h3>
                <p className={styles.supportCardDesc}>{topic.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="커플 앨범 공유 앱 사이사이 고객센터">
      <HomepageHeader />
      <SupportGrid />
    </Layout>
  );
}
