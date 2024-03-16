import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { displayPostModal } from '../function/others/displayPostModal';
import { findWorkspace } from '../function/repository/workspace';
import { SlashCommandRequestBody } from '../types/slackResponse';

// /zen で呼び出されるエンドポイント
export const displayModal = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  try {
    // request bodyの型を定義
    const requestBody = req.body as SlashCommandRequestBody;
    const workspaceId = requestBody.team_id;
    // ワークスペースIDからアクセストークンを取得
    const _workspace = await findWorkspace(workspaceId);
    if (!_workspace) throw new Error('workspace not found');
    const accessToken = _workspace.accessToken;
    const slackWebClient = new WebClient(accessToken);

    // request bodyから情報を取得
    const channelId = requestBody.channel_id;
    const triggerId = requestBody.trigger_id;
    console.log(req.body); // デバッグ用

    try {
      await displayPostModal(slackWebClient, triggerId, channelId);
      res.status(200).send('OK');
    } catch (e) {
      console.error('Error display modal: ', e);
      res.status(500).send('Error display modal');
    }
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).send('Error');
  }
});
