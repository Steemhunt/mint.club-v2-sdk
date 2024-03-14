import { CIDString, FilebaseClient } from '@filebase/client';
import { FilebaseKeyNeededErrror, InvalidImageProvidedError } from '../errors/sdk.errors';

export class IpfsHelper {
  public static async addWithFilebase(apiKey: string, buffer: Blob): Promise<CIDString> {
    if (!apiKey) throw new FilebaseKeyNeededErrror();

    const client = new FilebaseClient({ token: apiKey });
    const cid = await client.storeBlob(buffer, 'image.png');
    return cid;
  }

  public static isIpfsUrl(url: string) {
    return url.toLowerCase().startsWith('ipfs://');
  }

  public static isHttpUrl(url: string) {
    return url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://');
  }

  public static validateHttpUrl(url: string) {
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      throw new InvalidImageProvidedError();
    }
    const valid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    if (!valid) {
      throw new InvalidImageProvidedError();
    }
    return valid;
  }

  public static validateIpfsHash(ipfsUrl: string) {
    const hash = ipfsUrl.replace(/^ipfs:\/\//, '');

    // CIDv0, base58, starts with Qm, 46 characters
    const cidv0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;

    // CIDv1 in base32, starts with b, for simplicity assuming it's at least 50 characters
    // This is a simplified check and might not cover all cases
    const cidv1Pattern = /^b[1-9A-Za-z]{49,}$/;

    const matched = cidv0Pattern.test(hash) || cidv1Pattern.test(hash);

    if (!matched) {
      throw new InvalidImageProvidedError();
    }

    return matched;
  }
}
