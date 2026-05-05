/**
 * Rate Limiting 미들웨어
 *
 * IP별 분당 요청 수 제한 (기본 10회/분).
 * 봇·자동화 스크립트의 무차별 도구 호출 방지.
 *
 * 메모리 기반 단순 구현. 트래픽 증가 시 Redis 또는 Upstash로 마이그레이션 권장.
 */

import type { Request, Response, NextFunction } from 'express';

const MAX_REQUESTS_PER_IP_PER_MINUTE = parseInt(
  process.env.MAX_REQUESTS_PER_IP_PER_MINUTE ?? '10',
  10
);

const WINDOW_MS = 60 * 1000;

interface RequestCounter {
  count: number;
  windowStart: number;
}

const counters = new Map<string, RequestCounter>();

// 메모리 누수 방지: 5분마다 만료된 엔트리 정리
setInterval(() => {
  const now = Date.now();
  for (const [ip, counter] of counters.entries()) {
    if (now - counter.windowStart > WINDOW_MS * 5) {
      counters.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  // 헬스체크와 컴플라이언스 엔드포인트는 제한 없음
  if (req.path === '/health' || req.path === '/.well-known/compliance.json') {
    return next();
  }

  const ip = getClientIp(req);
  const now = Date.now();

  let counter = counters.get(ip);

  if (!counter || now - counter.windowStart > WINDOW_MS) {
    counter = { count: 0, windowStart: now };
    counters.set(ip, counter);
  }

  counter.count += 1;

  if (counter.count > MAX_REQUESTS_PER_IP_PER_MINUTE) {
    const retryAfterSec = Math.ceil((counter.windowStart + WINDOW_MS - now) / 1000);
    res.setHeader('Retry-After', String(retryAfterSec));
    res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS_PER_IP_PER_MINUTE));
    res.setHeader('X-RateLimit-Remaining', '0');
    res.status(429).json({
      error: 'rate_limit_exceeded',
      message: `요청이 너무 빈번합니다. ${retryAfterSec}초 후 다시 시도해주세요.`,
      retry_after_seconds: retryAfterSec,
    });
    return;
  }

  res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS_PER_IP_PER_MINUTE));
  res.setHeader('X-RateLimit-Remaining', String(MAX_REQUESTS_PER_IP_PER_MINUTE - counter.count));

  next();
}

function getClientIp(req: Request): string {
  // Vercel/Cloudflare/일반 프록시 헤더 우선
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0];
    if (first) return first.trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') return realIp;
  return req.ip ?? 'unknown';
}
