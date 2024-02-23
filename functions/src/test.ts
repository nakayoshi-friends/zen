import dayjs = require('dayjs');
import * as functions from 'firebase-functions';

interface Config {
  deployinfo?: {
    date: string;
  };
}

const testApiHandler = functions.region('asia-northeast1').https.onRequest((req, res) => {
  const config = functions.config() as Config;
  if (!config?.deployinfo?.date) {
    res.send('config.deployinfo.date is undefined');
    return;
  }
  res.send(`this is deployed on ${dayjs(config.deployinfo.date).format('YYYY-MM-DD HH:mm:ss')}`);
});

export default testApiHandler;
