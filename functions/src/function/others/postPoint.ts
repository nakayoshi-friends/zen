import { ChatPostEphemeralArguments, WebClient } from '@slack/web-api';

import { DOKOKICHI_WORKSPACE_ID } from '../../constants';
import { User } from '../../types/models/user';
import { DonatedPoint, Zenkou } from '../../types/models/zenkou';
import { findUser, updateUser } from '../repository/user';
import { findZenkou, updateZenkou } from '../repository/zenkou';

export const postPoint = async (
  slackWebClient: WebClient,
  channelId: string,
  amount: number,
  postUserId: string,
  zenkouUserId: string,
  zenkouId: string,
) => {
  let postUser = await findUser(DOKOKICHI_WORKSPACE_ID, postUserId);
  // selectedUserのドキュメントが存在しなければ新規作成し、200 zen付与する
  if (!postUser) {
    const newUser: User = {
      id: postUserId,
      availablePoint: 200,
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await updateUser(DOKOKICHI_WORKSPACE_ID, newUser);
    postUser = newUser;
  }

  const zenkou = await findZenkou(DOKOKICHI_WORKSPACE_ID, zenkouUserId, zenkouId);
  if (!zenkou) throw new Error('zenkou not found');

  // 同じ善行に対して複数回投げ銭できないようにする
  if (zenkou.donatedPointList.some((donatedPoint) => donatedPoint.userId === postUserId)) {
    const postEphemeral: ChatPostEphemeralArguments = {
      channel: channelId,
      user: postUserId,
      text: 'このzenにはすでに投げ銭済みです。',
    };
    // あなただけに表示されるメッセージを送信
    await slackWebClient.chat.postEphemeral(postEphemeral);
    return;
  }

  // メッセージの内容を設定
  const postEphemeral: ChatPostEphemeralArguments = {
    channel: channelId,
    user: postUserId, // エフェメラルメッセージを表示するユーザーのID
    text: `${amount}zen 投げ銭しました。今週はあと${postUser.availablePoint - amount}zenです。`,
  };
  // あなただけに表示されるメッセージを送信
  await slackWebClient.chat.postEphemeral(postEphemeral);

  // postUserからzenを引く
  const updatedUser: User = {
    ...postUser,
    availablePoint: postUser.availablePoint - amount,
  };
  await updateUser(DOKOKICHI_WORKSPACE_ID, updatedUser);

  // zenkouにzenを加算
  const newDonatedPoint: DonatedPoint = {
    userId: postUserId,
    point: amount,
    createdAt: Date.now(),
  };
  const donatedPointList = [...zenkou.donatedPointList, newDonatedPoint];
  const updatedZenkou: Zenkou = {
    ...zenkou,
    donatedPointList: donatedPointList,
  };
  await updateZenkou(DOKOKICHI_WORKSPACE_ID, zenkouUserId, updatedZenkou);
};
