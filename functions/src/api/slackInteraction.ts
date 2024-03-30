/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { postPoint } from '../function/others/postPoint';
import { sendZenkouForm } from '../function/others/sendZenkouForm';
import { updateChannelId } from '../function/others/updateChannelId';
import { findWorkspace } from '../function/repository/workspace';
import { InteractionRequestBody, ModalInputValues } from '../types/slackResponse';

// slack上のアクション時呼ばれるエンドポイント
export const slackInteraction = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  try {
    // リクエストのペイロードを解析する
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const payload = JSON.parse(req.body.payload || '{}') as InteractionRequestBody;
    console.log('payload:', payload); // デバッグ用

    const workspaceId = payload.team?.id ?? '';
    // ワークスペースIDからアクセストークンを取得

    const _workspace = await findWorkspace(workspaceId);
    if (!_workspace) throw new Error('workspace not found');
    const accessToken = _workspace.accessToken;
    const slackWebClient = new WebClient(accessToken);

    // Slackからのイベントタイプによって処理を分岐
    switch (payload.type) {
      // モーダルの送信イベントを処理
      case 'view_submission': {
        try {
          // モーダルの送信イベントの場合なので、モーダルの入力値の型にキャスト
          const values = payload.view?.state.values as ModalInputValues;
          const selectedUserId = values.zen_user?.['users_select-action']?.selected_user ?? '';
          const channelId = _workspace.zenkouChannelId;
          const userInput = values.zen_content?.['plain_text_input-action']?.value ?? '';

          await sendZenkouForm(slackWebClient, selectedUserId, userInput, workspaceId, channelId);
          // 必要な処理を行った後、正常に処理されたことをSlackに通知
          res.json({ response_action: 'clear' });
        } catch (e) {
          console.error('Error posting message: ', e);
          res.status(500).send('Error posting message to Slack');
        }
        break;
      }

      // ボタンのクリックイベントを処理
      case 'block_actions': {
        // action_idによって処理を分岐
        const channelId = payload.channel?.id ?? '';
        const postedUserId = payload.user.id;
        const messageTs = payload.message?.ts ?? ''; // zenkouIdにあたる
        const text = payload.message?.text ?? '';
        const zenkouUserId = text.match(/<@(\w+)>/)?.[1] ?? ''; // 正規表現を使用してテキストからユーザーIDを抽出

        switch (payload?.actions?.[0].action_id) {
          // zenを投げるボタンを押したときの処理
          case 'action-10':
            await postPoint(slackWebClient, workspaceId, channelId, 10, postedUserId, zenkouUserId, messageTs);
            res.status(200).send('OK');
            break;
          case 'action-20':
            await postPoint(slackWebClient, workspaceId, channelId, 20, postedUserId, zenkouUserId, messageTs);
            res.status(200).send('OK');
            break;
          case 'action-30':
            await postPoint(slackWebClient, workspaceId, channelId, 30, postedUserId, zenkouUserId, messageTs);
            res.status(200).send('OK');
            break;
          // モーダルでユーザーを選択したときの処理
          case 'users_select-action':
            // 何もしない
            res.status(200).send('OK');
            break;
          case 'channel_select-action': {
            if (!('selected_channel' in payload.actions[0])) throw new Error('selected_channel is not found');
            const selectedChannel = payload.actions[0].selected_channel as string;
            const teamId = payload.team?.id;
            await updateChannelId(teamId, selectedChannel);
            res.status(200).send('OK');
            break;
          }
          default:
            console.log('未知のアクションID:', payload?.actions?.[0].action_id);
            res.status(400).send('未知のアクションIDです');
        }
        break;
      }

      default:
        // 予期しないイベントタイプの場合
        console.log('未知のイベントタイプ:', payload.type);
        res.status(400).send('未知のイベントタイプです');
    }
  } catch (e) {
    console.error('Error: workspace not found');
    return;
  }
});
