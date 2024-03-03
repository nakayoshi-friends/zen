import { WebClient } from '@slack/web-api';

export const postPoint = async (
  slackWebClient: WebClient,
  channelId: string,
  amount: number,
  postUserId: string,
  zenkouId: string,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await slackWebClient.chat.postEphemeral({
    channel: channelId,
    user: postUserId, // エフェメラルメッセージを表示するユーザーのID
    text: '10zen 投げ銭しました。今週はあと90zenです。',
  });

  // postUserのdocumentが存在しなければドキュメントを新規作成し、200 zen付与

  // postUserからzenを引く

  // zenkouにzenを加算
};
