import { ViewsPublishArguments, WebClient } from '@slack/web-api';

export const displayHomeTab = async (
  slackWebClient: WebClient,
  token: string,
  userId: string,
  initialChannelId: string,
): Promise<void> => {
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
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ':hash: *チャンネルを設定*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '月曜午前0時にzenランキングを投稿するチャンネルを設定します。',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'channels_select',
              initial_channel: initialChannelId,
              placeholder: {
                type: 'plain_text',
                text: 'チャンネルを選択',
                emoji: true,
              },
              action_id: 'channel_select-action',
            },
          ],
        },
      ],
    },
  };
  await slackWebClient.views.publish(homeTabViewJSON);
};
