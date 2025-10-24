
export type Locale = 'en' | 'ko';
export const dictionaries: Record<Locale, Record<string, string>> = {
  en: { title:'Run with Jesus 2025', subtitle:'Run crew gallery & write-ups', events:'Events', upload:'Upload Image', caption:'Caption', imageFile:'Image File (.png/.jpg)', save:'Save', delete:'Delete', writeup:'Run Crew Write-up', writeupPlaceholder:'Share your collective thoughts about this run...', updateWriteup:'Update Write-up', images:'Images', noImages:'No images yet.', back:'Back', download:'Download', confirmDelete:'Delete this image?', language:'Language', english:'English', korean:'한국어', open:'Open', event_sept:'September Belmont Waterdog Run', event_oct:'October Stanford Dish Run', event_dec:'December TBD End of Year Run' },
  ko: { title:'Run with Jesus 2025', subtitle:'런 크루 사진 & 글 모음', events:'이벤트', upload:'이미지 업로드', caption:'캡션', imageFile:'이미지 파일 (.png/.jpg)', save:'저장', delete:'삭제', writeup:'크루 후기', writeupPlaceholder:'이번 러닝에 대한 크루의 생각을 함께 남겨주세요…', updateWriteup:'후기 업데이트', images:'이미지', noImages:'아직 이미지가 없습니다.', back:'뒤로', download:'다운로드', confirmDelete:'이 이미지를 삭제할까요?', language:'언어', english:'English', korean:'한국어', open:'열기', event_sept:'9월 벨몬트 워터독 런', event_oct:'10월 스탠퍼드 디시 런', event_dec:'12월 연말 러닝 (미정)' }
};
export function t(locale: Locale, key: string){ const dict = dictionaries[locale] ?? dictionaries.en; return dict[key] ?? key; }
export const EVENTS = [
  { slug: 'september-belmont-waterdog-run', dictKey: 'event_sept' },
  { slug: 'october-stanford-dish-run', dictKey: 'event_oct' },
  { slug: 'december-tbd-end-of-year-run', dictKey: 'event_dec' }
] as const;
export type EventSlug = typeof EVENTS[number]['slug'];
