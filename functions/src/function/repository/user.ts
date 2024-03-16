import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { VERSION } from '../../constants';
import { firestore } from '../../init';
import { User } from '../../types/models/user';

export const fetchUserList = async (workspaceId: string) => {
  const _collectionRef = firestore
    .collection(`version/${VERSION}/workspace/${workspaceId}/user`)
    .withConverter(userConverter);
  const _queryDocSnapshot = (await _collectionRef.get()).docs;
  const _users = _queryDocSnapshot.map((_doc) => _doc.data());
  return _users;
};

export const findUser = async (workspaceId: string, userId: string): Promise<User | null> => {
  const _docRef = firestore
    .collection(`version/${VERSION}/workspace/${workspaceId}/user`)
    .doc(userId)
    .withConverter(userConverter);
  const _docSnapshot = await _docRef.get();
  const _User = _docSnapshot.data();
  return _User || null;
};

// createもこれを使う
export const updateUser = async (workspaceId: string, updatedUser: User): Promise<void> => {
  const _docRef = firestore
    .collection(`version/${VERSION}/workspace/${workspaceId}/user`)
    .doc(updatedUser.id)
    .withConverter(userConverter);
  await _docRef.set(updatedUser);
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
