import { WebClient } from '@slack/web-api';
import * as functions from 'firebase-functions';

import { displayHomeTab } from '../function/others/displayHomeTab';
import { findWorkspace } from '../function/repository/workspace';
import { BaseEventRequestBody, ChallengeEventRequestBody } from '../types/slackResponse';

export const slackEvents = functions.region('asia-northeast1').https.onRequest(async (req, res) => {
  try {
    // verification用
    const requestBody = req.body as BaseEventRequestBody | ChallengeEventRequestBody;
    if (requestBody.type === 'url_verification') {
      if (!('challenge' in requestBody)) throw new Error('challenge is not found');
      res.status(200).send({
        challenge: requestBody.challenge,
      });
    }

    if (!('event' in requestBody)) throw new Error('event is not found');
    if (requestBody.event.type === 'app_home_opened') {
      const slackWebClient = new WebClient(requestBody.token);
      if (!('user' in requestBody.event)) throw new Error('user is not found');
      if (!('team_id' in requestBody)) throw new Error('team_id is not found');
      const workspace = await findWorkspace(requestBody.team_id);
      if (!workspace) throw new Error('workspace not found');
      await displayHomeTab(slackWebClient, workspace?.accessToken, requestBody.event.user, workspace.zenkouChannelId);
    }
  } catch (e) {
    console.error('Error: ', e);
    res.status(500).send('Error');
  }
});
