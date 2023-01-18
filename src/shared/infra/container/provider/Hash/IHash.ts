export interface IHash {
  generate(value: string, salt?: number): Promise<string>;
  verify(value: string, hash: string): Promise<boolean>;
}
