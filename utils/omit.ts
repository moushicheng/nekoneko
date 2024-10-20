export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result: Partial<T> = { ...obj }; // 创建对象的浅拷贝
  for (const key of keys) {
    delete result[key]; // 删除指定的属性
  }
  return result as Omit<T, K>; // 类型断言
}
