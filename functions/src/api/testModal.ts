/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { sendZenkouForm } from '../function/others/sendZenkouForm';

export const testModalApi = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // Bot User OAuth Access Tokenを設定
  const web = new WebClient(process.env.SLACK_TOKEN);

  // リクエストのペイロードを解析する
  // FIXME: eslint-disableを外す
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
  const payload = JSON.parse(req.body.payload || '{}');
  console.log('payload:', payload); // デバッグ用

  // Slackからのイベントタイプによって処理を分岐
  switch (payload.type) {
    case 'view_submission': {
      sendZenkouForm(res);
      break;
    }
    case 'block_actions': {
      // ブロックアクション（ボタンクリックなど）の処理。いらないかも
      console.log('ブロックアクションを処理');
      // 処理後のレスポンスを送信
      res.send('OK');
      break;
    }
    case 'shortcut': {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
      const { trigger_id } = JSON.parse(req.body.payload);
      const result = await web.views.open({
        trigger_id: trigger_id as string,
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: 'My App',
            emoji: true,
          },
          submit: {
            type: 'plain_text',
            text: '送信',
            emoji: true,
          },
          close: {
            type: 'plain_text',
            text: 'キャンセル',
            emoji: true,
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '誰のzenを報告する？',
              },
              accessory: {
                type: 'users_select',
                placeholder: {
                  type: 'plain_text',
                  text: 'Select a user',
                  emoji: true,
                },
                action_id: 'users_select-action',
              },
            },
            {
              type: 'input',
              element: {
                type: 'plain_text_input',
                action_id: 'plain_text_input-action',
              },
              label: {
                type: 'plain_text',
                text: 'どんなzen？',
                emoji: true,
              },
            },
          ],
        },
      });
      console.log(result);
      res.send('OK');
      break;
    }
    default:
      // 予期しないイベントタイプの場合
      console.log('未知のイベントタイプ:', payload.type);
      res.status(400).send('未知のイベントタイプです');
  }
});
