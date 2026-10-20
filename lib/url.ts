/**
 * 开发模式下 Next 传给动态路由的参数是 URL 编码后的值
 * （/tags/随笔 → "%E9%9A%8F%E7%AC%94"），生产构建时是解码后的值。
 * 统一在这里解码，保证两种模式行为一致。
 */
export function decodeParam(value: string): string {
  if (!value.includes("%")) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
