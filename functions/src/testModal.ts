/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as functions from 'firebase-functions';
import { WebClient } from '@slack/web-api';

const testModalApiHandler = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  const web = new WebClient(process.env.SLACK_TOKEN);
  console.log(req.body.payload);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const trigger_id: string = req.body.payload.trigger_id as string;
  const result = await web.views.open({
    trigger_id: trigger_id,
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
});

export default testModalApiHandler;
