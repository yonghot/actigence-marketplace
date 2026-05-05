/**
 * Rate Limiting 미들웨어
 *
 * IP별 분당 요청 수 제한 (기본 10회/분).
 * 봇·자동화 스크립트의 무차별 도구 호출 방지.
 *
 * 메모리 기반 단순 구현. 트래픽 증가 시 Redis 또는 Upstash로 마이그레이션 권장.
 */
import type { Request, Response, NextFunction } from 'express';
export declare function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void;
