import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { displayPostModal } from '../function/others/displayPostModal';

// /zen で呼び出されるエンドポイント
export const displayModal = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // Bot User OAuth Access Tokenを設定
  const slackWebClient = new WebClient(process.env.SLACK_TOKEN);

  // request bodyから情報を取得
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const channelId = req.body.channel_id as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const triggerId = req.body.trigger_id as string;
  console.log(req.body); // デバッグ用

  try {
    await displayPostModal(slackWebClient, triggerId, channelId);
    res.status(200).send('OK');
  } catch (e) {
    console.error('Error display modal: ', e);
    res.status(500).send('Error display modal');
  }
});
