/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { sendZenkouForm } from '../function/others/sendZenkouForm';

export const slackInteraction = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  // Bot User OAuth Access Tokenを設定
  const web = new WebClient(process.env.SLACK_TOKEN);

  // リクエストのペイロードを解析する
  // FIXME: eslint-disableを外す
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
  const payload = JSON.parse(req.body.payload || '{}');

  console.log('payload:', payload); // デバッグ用

  // Slackからのイベントタイプによって処理を分岐
  switch (payload.type) {
    // モーダルの送信イベントを処理
    case 'view_submission': {
      try {
        const selectedUserId = payload.view.state.values['zen_user']['users_select-action']?.selected_user as string;
        const channelId = payload.view.state.values['posted_channel']['channel_input'].value as string;
        const userInput = payload.view.state.values['zen_content']['plain_text_input-action'].value as string;
        await sendZenkouForm(web, selectedUserId, userInput, channelId, res);
        // 必要な処理を行った後、正常に処理されたことをSlackに通知
        res.json({ response_action: 'clear' });
      } catch (e) {
        console.error('Error posting message: ', e);
        res.status(500).send('Error posting message to Slack');
      }
      break;
    }

    case 'block_actions': {
      // action_idによって処理を分岐
      switch (payload.actions[0].action_id) {
        case 'action-10':
          console.log('10ポイントを投げた');
          break;
        case 'action-20':
          console.log('20ポイントを投げた');
          break;
        case 'action-30':
          console.log('30ポイントを投げた');
          break;
        default:
          console.log('未知のアクションID:', payload.actions[0].action_id);
          res.status(400).send('未知のアクションIDです');
      }
      break;
    }

    case 'message_action': {
      // 多分不要
      try {
        console.log('message_actionを処理');
      } catch (e) {
        console.error('Error display modal: ', e);
        res.status(500).send('Error display modal');
      }
      break;
    }

    case 'shortcut': {
      // 多分不要
      try {
        console.log('shortcutを処理');
      } catch (e) {
        console.error('Error display modal: ', e);
        res.status(500).send('Error display modal');
      }
      break;
    }

    default:
      // 予期しないイベントタイプの場合
      console.log('未知のイベントタイプ:', payload.type);
      res.status(400).send('未知のイベントタイプです');
  }
});