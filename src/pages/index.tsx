import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

type Topic = {title: string; description: string; slug: string; keywords?: string};
const groups: {title: string; topics: Topic[]}[] = [
  {title: '처음 함께하는 사이사이', topics: [
    {title: '시작하기', description: '로그인부터 두 사람의 첫 기록까지', slug: 'getting-started', keywords: '회원가입 가입 커플 연결'},
    {title: '파트너 초대', description: '초대 코드를 보내고 같은 공간으로 연결하기', slug: 'invite-partner', keywords: '연인 남자친구 여자친구 연결'},
    {title: '자주 묻는 질문', description: '이용 중 궁금한 점을 빠르게 확인하기', slug: 'faq', keywords: 'FAQ 오류 문제'},
  ]},
  {title: '우리의 추억 남기기', topics: [
    {title: '앨범 만들기', description: '날짜를 정하고 앨범과 커버 관리하기', slug: 'create-album'},
    {title: '사진·동영상 공유', description: '사진과 영상 올리기, 저장과 댓글', slug: 'share-album', keywords: '업로드 다운로드 권한 하트 마음'},
    {title: '다이어리 쓰기', description: '하루의 이야기와 댓글 남기기', slug: 'diary', keywords: '일기 글 하트 마음'},
    {title: '다락방 이용하기', description: '즐겨찾기 앨범, 메모와 일정 모아보기', slug: 'attic'},
  ]},
  {title: '계정과 기록 보호하기', topics: [
    {title: '이메일 비밀번호 찾기', description: '이메일 인증으로 로그인 비밀번호 재설정', slug: 'account-recovery', keywords: '로그인 암호 분실 복구'},
    {title: '앱 잠금', description: '6자리 비밀번호와 Face ID·지문 설정', slug: 'app-lock', keywords: '보안 암호 생체인증 분실 복구'},
    {title: '보안과 프라이버시', description: '사진 권한과 알림, 계정 보호 안내', slug: 'privacy-security', keywords: '개인정보'},
  ]},
  {title: '서비스 이용 안내', topics: [
    {title: '데이터 백업 및 보관', description: '기록을 보관하는 방법과 복원 정책', slug: 'backup-restore', keywords: '복구 원본 사진'},
    {title: '요금제와 결제', description: '무료 이용과 결제 정책 확인하기', slug: 'plans-billing', keywords: '구독 비용 환불'},
  ]},
];

function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home(): ReactNode {
  const [query, setQuery] = useState('');
  const term = query.trim().toLocaleLowerCase();
  const visibleGroups = groups.map(group => ({...group, topics: group.topics.filter(topic =>
    `${topic.title} ${topic.description} ${topic.keywords ?? ''}`.toLocaleLowerCase().includes(term),
  )})).filter(group => group.topics.length > 0);
  const count = visibleGroups.reduce((total, group) => total + group.topics.length, 0);

  return (
    <Layout title="도움말" description="사이사이 이용 중 궁금한 점을 찾아보세요. 파트너 초대, 사진 공유, 다이어리와 계정 보호를 안내합니다.">
      <main className={styles.home}>
        <header className={styles.hero}>
          <div className={styles.frame}>
            <Heading as="h1">무엇을 도와드릴까요?</Heading>
            <p className={styles.intro}>두 사람의 기록이 편안하게 이어지도록, 사이사이 이용 방법을 안내해요.</p>
            <div className={styles.search} role="search" aria-label="도움말 주제 검색">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.7"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
              <input type="search" aria-label="도움말 검색" placeholder="궁금한 내용을 입력해 주세요" value={query} onChange={event => setQuery(event.target.value)} />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="검색어 지우기">지우기</button>}
            </div>
            <nav className={styles.quickLinks} aria-label="바로 찾는 도움말">
              <Link to="/docs/help/invite-partner">파트너 초대 <Arrow /></Link>
              <Link to="/docs/help/account-recovery">비밀번호 찾기 <Arrow /></Link>
              <Link to="/docs/help/app-lock">앱 잠금 <Arrow /></Link>
            </nav>
          </div>
        </header>

        <section className={`${styles.frame} ${styles.guides}`} aria-label="주제별 도움말">
          <div className={styles.sectionHeading}>
            <Heading as="h2">{term ? '검색한 도움말' : '어떤 도움이 필요하세요?'}</Heading>
            <span role="status" aria-live="polite">{term ? `${count}개의 도움말` : '주제별로 살펴보세요'}</span>
          </div>
          {count ? <div className={styles.groups}>
            {visibleGroups.map(group => <section className={styles.group} key={group.title}>
              <Heading as="h3">{group.title}</Heading>
              <ul>
                {group.topics.map(topic => <li key={topic.slug}>
                  <Link className={styles.topic} to={`/docs/help/${topic.slug}`}>
                    <div><span className={styles.topicTitle}>{topic.title}</span><p>{topic.description}</p></div><Arrow />
                  </Link>
                </li>)}
              </ul>
            </section>)}
          </div> : <div className={styles.empty}>
            <p>일치하는 도움말을 찾지 못했어요.</p>
            <span>‘사진’, ‘초대’, ‘비밀번호’처럼 짧은 단어로 다시 찾아보세요.</span>
            <button type="button" onClick={() => setQuery('')}>전체 도움말 보기 <Arrow /></button>
          </div>}
        </section>

        <section className={styles.news}>
          <div className={`${styles.frame} ${styles.newsInner}`}>
            <div><Heading as="h2">사이사이의 새로운 소식</Heading><p>마음 전하기부터 앱 잠금까지,<br />새롭게 더해진 기능을 만나보세요.</p></div>
            <Link to="/blog/release-1-9-4" className={styles.release}><span>1.9.4 업데이트 안내</span><Arrow /></Link>
            <Link to="/blog" className={styles.allUpdates}>모든 업데이트 보기 <Arrow /></Link>
          </div>
        </section>

        <section className={`${styles.frame} ${styles.contact}`}>
          <div><Heading as="h2">아직 해결되지 않았나요?</Heading><p>앱 버전과 기기 종류, 문제가 생긴 상황을 알려주세요.<br />보내주신 내용을 확인하고 답변드릴게요.</p></div>
          <a href="mailto:help@corretto.io" className={styles.contactLink}>이메일로 문의하기 <Arrow /><span>help@corretto.io</span></a>
        </section>
      </main>
    </Layout>
  );
}
