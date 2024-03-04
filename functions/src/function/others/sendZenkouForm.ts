import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { DOKOKICHI_WORKSPACE_ID } from '../../constants';
import { User } from '../../types/models/user';
import { Zenkou } from '../../types/models/zenkou';
import { findUser, updateUser } from '../repository/user';
import { updateZenkou } from '../repository/zenkou';

// 善行送信モーダルのsendを押したときの処理
export const sendZenkouForm = async (
  slackWebClient: WebClient,
  selectedUserId: string,
  userInput: string, // モーダルから入力されたテキスト
  channelId: string, // 投稿するチャンネルID
  res: functions.Response<any>,
): Promise<void> => {
  // モーダルの送信イベントの処理

  const selectedUser = await findUser(DOKOKICHI_WORKSPACE_ID, selectedUserId);
  // selectedUserのドキュメントが存在しなければ新規作成し、200 zen付与する
  if (!selectedUser) {
    const newUser: User = {
      id: selectedUserId,
      availablePoint: 200,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await updateUser(DOKOKICHI_WORKSPACE_ID, newUser);
  }

  // メッセージの内容を設定
  const postMessage: ChatPostMessageArguments = {
    channel: channelId,
    text: `<@${selectedUserId}> さんの善行が投稿されたよ！\n${userInput}\n\nzenを投げてあげよう！`, // プレーンテキストとしてのフォールバックテキスト
    blocks: [
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `<@${selectedUserId}> さんの善行が投稿されたよ！`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: userInput, // ブロック内のテキストメッセージ
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
  const response = await slackWebClient.chat.postMessage(postMessage);
  const messageTs = response.ts;
  if (!messageTs) throw new Error('messageTs is undefined');

  // dbのzenkouコレクションにデータを追加する処理を書く
  const zenkou: Zenkou = {
    id: messageTs,
    content: userInput,
    donatedPointList: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isDeleted: false,
  };
  await updateZenkou(DOKOKICHI_WORKSPACE_ID, selectedUserId, zenkou);
};
