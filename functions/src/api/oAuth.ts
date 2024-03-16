import axios from 'axios';
import * as functions from 'firebase-functions';

import { updateWorkspace } from '../function/repository/workspace';
import { Workspace } from '../types/models/workspace';
import { SlackOAuthResponse } from '../types/slackResponse';

// OAuthで呼び出されるエンドポイント
export const oAuth = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  if (req.query.code) {
    try {
      // Slackからの認証コードを取得
      const code = req.query.code;
      // slack apiのGUIで確認できるトークン等
      const clientId = process.env.SLACK_CLIENT_ID;
      const clientSecret = process.env.SLACK_CLIENT_SECRET;
      const redirectUri = process.env.SLACK_REDIRECT_URI;

      // Slack OAuthエンドポイントにリクエストを送信してアクセストークンを取得
      const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        },
      });

      const data = response.data as SlackOAuthResponse;
      console.log(data); // デバッグ用

      if (data.ok) {
        // アクセストークン取得成功
        const accessToken = data.access_token;
        // アクセストークンをデータベースに保存
        const workspaceId = data.team.id;
        const _newWorkspace: Workspace = {
          id: workspaceId,
          name: 'test',
          accessToken: accessToken ?? '',
          zenkouChannelId: 'test',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await updateWorkspace(_newWorkspace);

        // 成功レスポンスを返す
        res.status(200).send('Authentication successful!');
      } else {
        // Slack APIからエラーが返された場合
        console.error('Error getting access token:');
        res.status(500).send('Authentication failed.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).send('Authentication failed.');
    }
  } else {
    // 認証コードがリクエストに含まれていない場合
    res.status(400).send('Invalid request. No code provided.');
  }
});
