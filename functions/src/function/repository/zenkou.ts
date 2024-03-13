import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { VERSION } from '../../constants';
import { firestore } from '../../init';
import { Zenkou } from '../../types/models/zenkou';

export const fetchZenkouList = async (workspaceId: string, userId: string) => {
  const _collectionRef = firestore
    .collection(`version/${VERSION}/workspace/${workspaceId}/user/${userId}/zenkou`)
    .withConverter(zenkouConverter);
  const _querySnapshot = await _collectionRef.get();
  const _docs = _querySnapshot.docs;
  const _ladies = _docs.map((_doc) => _doc.data());
  return _ladies;
};

export const findZenkou = async (workspaceId: string, userId: string, zenkouId: string): Promise<Zenkou | null> => {
  const _docRef = firestore
    .collection(`version/${VERSION}/workspace/${workspaceId}/user/${userId}/zenkou`)
    .doc(zenkouId)
    .withConverter(zenkouConverter);
  const _docSnapshot = await _docRef.get();
  const _Zenkou = _docSnapshot.data();
  return _Zenkou || null;
};

// createもこれを使う
export const updateZenkou = async (workspaceId: string, userId: string, updatedZenkou: Zenkou): Promise<void> => {
  const _docRef = firestore
    .collection(`version/${VERSION}/workspace/${workspaceId}/user/${userId}/zenkou`)
    .doc(updatedZenkou.id)
    .withConverter(zenkouConverter);
  await _docRef.set(updatedZenkou);
};

export const zenkouConverter: FirestoreDataConverter<Zenkou> = {
  toFirestore: (zenkou: Zenkou): DocumentData => {
    const newDoc: Partial<Zenkou> = { ...zenkou };
    delete newDoc.id;
    return newDoc;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Zenkou>): Zenkou => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      content: data.content,
      donatedPointList: data.donatedPointList,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
