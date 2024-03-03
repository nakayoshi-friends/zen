import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

// 善行送信モーダルのsendを押したときの処理
export const sendZenkouForm = async (
  slackWebClient: WebClient,
  selectedUserId: string,
  userInput: string, // モーダルから入力されたテキスト
  channelId: string, // 投稿するチャンネルID
  res: functions.Response<any>,
): Promise<void> => {
  // モーダルの送信イベントの処理

  // TODO: selectedUserのドキュメントが存在しなければ新規作成し、200 zen付与する処理を書く
  // TODO: dbのzenkouコレクションにデータを追加する処理を書く

  const postMessage: ChatPostMessageArguments = {
    channel: channelId,
    text: `<@${selectedUserId}> さんの善行が投稿されたよ！\n${userInput}\n\nzenを投げてあげよう！`, // プレーンテキストとしてのフォールバックテキスト
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<@${selectedUserId}> さんの善行が投稿されたよ！\n${userInput}`, // ブロック内のテキストメッセージ
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: 'zenを投げてあげよう！',
            emoji: true,
          },
        ],
      },
      {
        type: 'actions', // アクションブロックを追加
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '10',
              emoji: true,
            },
            value: '10',
            action_id: 'action-10',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '20',
              emoji: true,
            },
            value: '20',
            action_id: 'action-20',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '30',
              emoji: true,
            },
            value: '30',
            action_id: 'action-30',
          },
        ],
      },
    ],
  };

  // チャンネルにメッセージを投稿
  await slackWebClient.chat.postMessage(postMessage);
};
