import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { displayPostModal } from '../function/others/displayPostModal';
import { findWorkspace } from '../function/repository/workspace';

// /zen で呼び出されるエンドポイント
export const displayModal = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const workspaceId = req.body.team_id as string;
    // ワークスペースIDからアクセストークンを取得
    // ワークスペースIDからアクセストークンを取得
    const _workspace = await findWorkspace(workspaceId);
    if (!_workspace) throw new Error('workspace not found');
    const accessToken = _workspace.accessToken;
    const slackWebClient = new WebClient(accessToken);

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
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).send('Error');
  }
});
