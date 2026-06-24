// Deterministic pastel "topic" color class for a string.
// Mirrors the Design Handoff: hash the value and take % 10 to pick one of the
// .topic-c0 .. .topic-c9 classes defined in styles/main.css.
export function topicClass(value) {
  const s = String(value ?? '');
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return `topic-c${Math.abs(hash) % 10}`;
}
