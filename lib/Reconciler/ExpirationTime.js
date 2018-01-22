export const NoWork = 0
export const Sync = 1

// expirationTime is too too long, maybe change its name later
const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;

// 1 unit of expiration time represents 10ms.
export function msToExpirationTime(ms) {
  // 加上偏移量以避免10ms以内的与NoWork冲突
  return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
}

export function expirationTimeToMs(expirationTime) {
  return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

// 向上取整为precision的倍数
function ceiling(num, precision) {
  return (((num / precision) | 0) + 1) * precision;
}

// expirationInMs: 1000, bucketSizeMs: 200
// 200ms内都会有相同的expirationTime
export function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return ceiling(currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
}