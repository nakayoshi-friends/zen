import { ViewsPublishArguments, WebClient } from '@slack/web-api';

export const displayHomeTab = async (slackWebClient: WebClient, token: string, userId: string): Promise<void> => {
  const homeTabViewJSON: ViewsPublishArguments = {
    token: token,
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'zenを送り合いましょう',
          },
          accessory: {
            type: 'image',
            image_url: 'https://avatars.slack-edge.com/2024-03-15/6808743797157_f37a26f2a8f411c6d9b3_96.jpg',
            alt_text: 'calendar thumbnail',
          },
        },
        {
          type: 'input',
          element: {
            type: 'channels_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select channel',
              emoji: true,
            },
            action_id: 'multi_static_select-action',
          },
          label: {
            type: 'plain_text',
            text: 'zen用チャンネル',
            emoji: true,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'zen用チャンネルを設定',
                emoji: true,
              },
              action_id: 'set_zen_channel',
            },
          ],
        },
      ],
    },
  };
  await slackWebClient.views.publish(homeTabViewJSON);
};
