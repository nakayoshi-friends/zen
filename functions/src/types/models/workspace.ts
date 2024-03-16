import { DocumentBase } from '../base';

export interface Workspace extends DocumentBase {
  name: string;
  accessToken: string;
  zenkouChannelId: string;
}
