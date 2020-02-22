import { Injectable, NotFoundException } from '@nestjs/common';
import { UrlMetadata } from './interfaces/url-metadata.interface';
import { getUrlMetadataHelper } from './helpers/getUrlMetadata.helper';

@Injectable()
export class AppService {
  async getUrlMetadata(urlInput: string): Promise<UrlMetadata> {
    try {
      const { url, title, image, description } = await getUrlMetadataHelper(
        urlInput
      );
      return { url, title, image, description };
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
