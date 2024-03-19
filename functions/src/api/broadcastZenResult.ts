import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { decideTopZenkouer } from '../function/others/decideTopZenkouer';
import { shapeRankingScript } from '../function/others/shapeRankingScript';
import { fetchUserList, updateUser } from '../function/repository/user';
import { fetchWorkspaceList } from '../function/repository/workspace';
import { TotalPoint } from '../types/models/zenkou';

export const broadcastZenResult = functions
  .region('asia-northeast1')
  .pubsub.schedule('0 0 * * 1')
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    try {
      const workspaceList = await fetchWorkspaceList();
      for (const workspace of workspaceList) {
        try {
          if (!workspace) {
            console.error('workspace not found');
            continue;
          }
          const userList = await fetchUserList(workspace.id);
          if (userList.length === 0) continue;

          // ランキングを計算
          const totalPointList: TotalPoint[] = await decideTopZenkouer(workspace.id, userList);

          // pointを使い切ったuserを取得
          const usedPointUserList = userList.filter((user) => user.availablePoint === 0);
          const strUsedPointUserList =
            usedPointUserList.length === 0 ? 'なし' : usedPointUserList.map((user) => user.id).join('　さん　\n');

          // pointをリセット
          for (const user of userList) {
            user.availablePoint = 200;
            await updateUser(workspace.id, user);
          }

          // messageを送信
          const slackWebClient = new WebClient(workspace.accessToken);
          const channelId = workspace.zenkouChannelId;
          if (!channelId) {
            continue;
          }
          const postMessage: ChatPostMessageArguments = {
            channel: channelId,

            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: '結果発表〜！',
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: shapeRankingScript(totalPointList),
                },
              },
              {
                type: 'divider',
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*ポイントを使い切った人*\n ${strUsedPointUserList}`,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'plain_text',
                  text: '今週もたくさんポイントを送りましょう！',
                  emoji: true,
                },
              },
            ],
          };
          await slackWebClient.chat.postMessage(postMessage);
        } catch (e) {
          console.error(e);
          continue;
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
