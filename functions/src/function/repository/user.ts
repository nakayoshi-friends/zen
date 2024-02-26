import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { DOKOKICHI_WORKSPACE_ID, VERSION } from '../../constants';
import { firestore } from '../../init';
import { User } from '../../types/models/user';

export const fetechUserList = async () => {
  const _collectionRef = firestore
    .collection(`version/${VERSION}/workspace/${DOKOKICHI_WORKSPACE_ID}/user`)
    .withConverter(userConverter);
  const _querySnapshot = await _collectionRef.get();
  const _docs = _querySnapshot.docs;
  const _ladies = _docs.map((_doc) => _doc.data());
  return _ladies;
};

export const findUser = async (id: string): Promise<User | null> => {
  const _docRef = firestore.collection(`version/${VERSION}/users`).doc(id).withConverter(userConverter);
  const _docSnapshot = await _docRef.get();
  const _User = _docSnapshot.data();
  return _User || null;
};

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user: User): DocumentData => {
    const newDoc: Partial<User> = { ...user };
    delete newDoc.id;
    return newDoc;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<User>): User => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      availablePoint: data.availablePoint,
      isDeleted: data.isDeleted,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
