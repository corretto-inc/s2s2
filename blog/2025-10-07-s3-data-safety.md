---
slug: s3-data-safety
title: 우리의 추억은 이렇게 안전하게 보관됩니다
authors: [s2s2]
tags: [공지, 보안, 백업, S3]
description: 최근 대형 커플 앱 서비스의 이미지 유실 사례를 계기로 공개하는 사이사이의 파일 보관·복구 설계
---

최근 모 커플 앱 서비스에서 이미지 유실 이슈가 있었고, 많은 분들이 데이터 안전성에 대해 다시 고민하게 되었습니다. 사이사이는 비슷한 일이 일어나지 않도록 설계 단계부터 “복구 가능성”과 “오작동 내성”을 최우선으로 두고 있습니다. 아래는 우리가 AWS S3를 중심으로 파일(사진/영상)을 안전하게 보관하는 방법입니다.

## 핵심 요약

- 기본 버저닝과 변경 불가능(Immutable) 보관: S3 Versioning + Object Lock(Compliance)로 오삭제/랜섬웨어에 방어
- 다중 AZ 내구성 + 비용 효율 백업: S3 11 9 내구성, 버저닝·Object Lock, Glacier(Deep Archive) 주기 백업, 필요 시 동일 리전 교차 계정 복제(SRR)
- 전 구간 암호화: 업로드 시 TLS, 저장 시 SSE-S3(기본 암호화) 적용 — KMS 전환 로드맵 공개
- 정합성/무결성 보장: 멀티파트 업로드 체크섬(sha256) 검증, S3의 Strong Consistency 활용
- 수명주기/아카이브: 핫 스토리지→IA→Glacier(Deep Archive) 자동 전환과 장기 보존
- 모니터링/감사: CloudTrail(Data Events)·S3 Access Logs·Config·EventBridge 알림으로 이상 즉시 탐지
- 복구 절차/연습: 주기적 복구 리허설과 시뮬레이션으로 RTO/RPO 목표 상시 검증

## 1) 버저닝과 변경 불가능 보관

사람은 실수할 수 있습니다. 그래서 우리는 실수를 가정합니다.

- S3 Versioning: 모든 객체에 버전을 유지합니다. 삭제/덮어쓰기에도 과거 스냅샷이 남아 복구 가능합니다.
- S3 Object Lock(Compliance): 지정한 보존 기간 동안은 관리자라도 삭제/수정이 불가합니다. 랜섬웨어나 내부 실수로부터 2차 방어막이 됩니다.
- MFA Delete 운영: 중요 보관소에 대해 관리자 조작에도 추가 인증이 필요하도록 운영 절차를 둡니다.

예시(버킷 정책으로 Object Lock 비활성 업로드 금지):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPutObjectWithoutObjectLock",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::photos-prod/*",
      "Condition": {
        "Null": {"s3:object-lock-legal-hold": "true"}
      }
    }
  ]
}
```

## 2) 비용 효율 백업 전략(무 CRR)

CRR(교차 리전 복제)은 비용 부담이 커 현재 사용하지 않습니다. 대신 다음 조합으로 안전성과 비용을 균형 있게 확보합니다.

- S3의 다중 AZ 내구성(99.999999999%)을 기본으로 활용합니다.
- Versioning + Object Lock으로 오삭제·오버라이트에 대비합니다.
- 수명주기 정책으로 일정 기간 후 Glacier/Deep Archive로 이전해 장기 보관 비용을 절감합니다.
- 선택: 동일 리전 내 별도 “백업 전용 계정”으로 SRR(동일 리전 복제)을 비정기로 수행(예: 월 1회)하여 계정 격리를 통한 추가 방어를 제공합니다.
- 백업 작업 성공/실패·지연에 대해 CloudWatch 알람을 설정해 RPO를 관리합니다.

## 3) 전 구간 암호화 강제

- 전송 구간: HTTPS(TLS 1.2+)만 허용합니다.
- 저장 구간: 현재는 S3 관리형 키(SSE-S3, AES256) 기본 암호화를 사용합니다. 향후 SSE-KMS(고객 관리 CMK)로 전환해 키 수명주기와 접근 제어를 강화할 계획입니다.

예시(SSE-S3 강제 — 암호화 헤더 누락/오류 거부):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnEncryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::photos-prod/*",
      "Condition": {
        "Null": {"s3:x-amz-server-side-encryption": "true"}
      }
    },
    {
      "Sid": "EnforceSSES3",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::photos-prod/*",
      "Condition": {
        "StringNotEquals": {"s3:x-amz-server-side-encryption": "AES256"}
      }
    }
  ]
}
```

## 4) 무결성 검증과 Strong Consistency

- 멀티파트 업로드 시 sha256 체크섬을 제출하고 서버측에서 검증해 전송 중 변형을 차단합니다.
- S3는 생성/업데이트/삭제에 대해 Strong read-after-write 정합성을 제공합니다. 업로드 직후 조회 시점 경합을 고려해 응답 레이어에서 재시도·백오프를 적용합니다.

간단 예시(서버에서 사인된 업로드 URL 발급 — AWS SDK v3/TypeScript, SSE-S3 지정):

```ts
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({region: 'ap-northeast-2'});

export async function createSignedPutUrl(params: {
  bucket: string;
  key: string;
  contentType: string;
  checksumSHA256Base64: string;
}) {
  const command = new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    ContentType: params.contentType,
    ChecksumSHA256: params.checksumSHA256Base64,
    ServerSideEncryption: 'AES256',
  });
  return await getSignedUrl(s3, command, {expiresIn: 60});
}
```

## 5) 수명주기 관리와 아카이브

- 60일 이상 미조회 객체는 S3 Standard-IA로, 장기 보관은 Glacier/Deep Archive로 자동 전환합니다.
- 삭제는 “소프트” 기준(버전 삭제 마커)으로 진행하고, 실제 영구 삭제는 보존기간 이후에만 수행합니다.

예시(요약):

```json
{
  "Rules": [
    {"ID": "to-ia-60d", "Status": "Enabled", "Transition": {"Days": 60, "StorageClass": "STANDARD_IA"}},
    {"ID": "to-deep-archive-365d", "Status": "Enabled", "Transition": {"Days": 365, "StorageClass": "DEEP_ARCHIVE"}}
  ]
}
```

## 6) 접근 제어와 퍼블릭 차단

- Organization 레벨 SCP와 Block Public Access로 공용 노출을 차단합니다.
- IAM은 최소 권한 원칙(Least Privilege)으로 역할을 분리하고, 민감 작업은 Break-glass 절차와 MFA를 요구합니다.

## 7) 모니터링·감사·알림

- CloudTrail(Data Events)로 객체 읽기/쓰기 이벤트를 추적합니다.
- S3 Access Logs/CloudWatch 지표로 4xx/5xx·백업 작업 지연을 관찰하고, EventBridge로 보안 규칙 위반 시 알림을 발송합니다.
- AWS Config로 버저닝/암호화/퍼블릭 차단 상태를 지속 평가합니다.

## 8) 복구 전략과 리허설

- RTO/RPO 목표를 수립하고, 정기적으로 버전 롤백/백업 계정 복구 절차를 연습합니다.
- 실제 장애 시 플레이북에 따라 데이터 우선 복구→서비스 점진 재개 순으로 진행합니다.

---

사이사이는 “데이터는 곧 기억”이라고 생각합니다. 위 원칙을 바탕으로, 예상치 못한 상황에서도 여러분의 추억을 지키기 위해 계속 투자하고 개선하겠습니다. 추가로 궁금한 점이 있다면 언제든지 `help@corretto.io` 로 문의해 주세요.


