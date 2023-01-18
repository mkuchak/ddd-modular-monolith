import bcrypt from "bcryptjs";
import { IHash } from "~/shared/infra/container/provider/Hash/IHash";

export class BcryptJs implements IHash {
  async generate(value: string, salt = 6): Promise<string> {
    return await bcrypt.hash(value, salt);
  }

  async verify(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(hash, value);
  }
}
