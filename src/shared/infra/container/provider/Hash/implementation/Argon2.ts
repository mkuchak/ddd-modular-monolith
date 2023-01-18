import { hash, verify } from "argon2";
import { IHash } from "~/shared/infra/container/provider/Hash/IHash";

export class Argon2 implements IHash {
  async generate(value: string, _salt?: number): Promise<string> {
    return await hash(value);
  }

  async verify(value: string, hash: string): Promise<boolean> {
    return await verify(value, hash);
  }
}
