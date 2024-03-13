import { User } from '../../types/models/user';
import { TotalPoint } from '../../types/models/zenkou';
import { fetchZenkouList } from '../repository/zenkou';

export const decideTopZenkouer = async (workspaceId: string, userList: User[]) => {
  const totalPointList: TotalPoint[] = [];
  for (const user of userList) {
    // userごとのzenkouListをfetch
    const zenkouList = await fetchZenkouList(workspaceId, user.id);
    // userごとのzenkouListを元に、userごとのpointを計算
    const point = zenkouList.reduce((acc, zenkou) => {
      return (
        acc +
        zenkou.donatedPointList.reduce((acc, donatedPoint) => {
          return acc + donatedPoint.point;
        }, 0)
      );
    }, 0);
    totalPointList.push({ userId: user.id, point });
  }
  // totalPointListをsort
  totalPointList.sort((a, b) => {
    return b.point - a.point;
  });
  // totalPointListが3以下の場合はそのままreturn
  if (totalPointList.length < 3) {
    return totalPointList;
  }
  // top3をreturn
  return totalPointList.slice(0, 3);
};
