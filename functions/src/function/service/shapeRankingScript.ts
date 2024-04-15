import { TotalPoint } from '../../types/models/zenkou';

export const shapeRankingScript = (totalPointList: TotalPoint[]) => {
  const rankingScript = totalPointList
    .map((totalPoint, index) => {
      return `${index + 1}位: <@${totalPoint.userId}> ${totalPoint.point}zen`;
    })
    .join('\n');
  return `*獲得ポイント数ランキング*\n${rankingScript}`;
};
