export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  // Recover recebe um argumento de tipo e retorna esse argumento ou nulo
  recover<T>(key: string): Promise<T | null>;
  invalidate(key: string): Promise<void>;
  invalidatePrefix(prefix: string): Promise<void>;
}
