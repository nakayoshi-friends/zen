import { ViewsOpenArguments, WebClient } from '@slack/web-api';

export const displayPostModal = async (
  slackWebClient: WebClient,
  triggerId: string,
  channelId: string,
): Promise<void> => {
  const modalViewJSON: ViewsOpenArguments = {
    trigger_id: triggerId,
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
          block_id: 'zen_user',
          text: {
            type: 'mrkdwn',
            text: '*誰の善行を報告する？*',
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
          block_id: 'zen_content',
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'plain_text_input-action',
          },
          label: {
            type: 'plain_text',
            text: 'どんな善行？',
            emoji: true,
          },
        },
      ],
    },
  };

  await slackWebClient.views.open(modalViewJSON);
};
