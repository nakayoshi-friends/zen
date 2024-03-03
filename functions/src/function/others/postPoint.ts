export const postPoint = async (amount: number, postUserId: string, zenkouId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // postUserのdocumentが存在しなければドキュメントを新規作成し、200 zen付与

  // postUserからzenを引く

  // zenkouにzenを加算
};
