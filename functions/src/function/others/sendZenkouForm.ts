import * as functions from 'firebase-functions';

// 善行送信モーダルのsendを押したときの処理
export const sendZenkouForm = (res: functions.Response<any>) => {
  // モーダルの送信イベントの処理
  console.log('モーダル送信イベントを処理');
  // 必要な処理を行った後、正常に処理されたことをSlackに通知
  res.json({ response_action: 'clear' });
};
