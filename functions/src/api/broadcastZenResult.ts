import * as functions from 'firebase-functions';

// TODO: 実装する
export const broadcastZenResult = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 1 week')
  .onRun(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('結果発表〜〜！');
  });
