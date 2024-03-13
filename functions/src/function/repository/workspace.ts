import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { VERSION } from '../../constants';
import { firestore } from '../../init';
import { Workspace } from '../../types/models/workspace';

export const fetchWorkspaceList = async () => {
  const _collectionRef = firestore.collection(`version/${VERSION}/workspace`).withConverter(workSpaceConverter);
  const _querySnapshot = await _collectionRef.get();
  const _docs = _querySnapshot.docs;
  const _workspaces = _docs.map((_doc) => _doc.data());
  return _workspaces;
};

export const findWorkspace = async (workspaceId: string): Promise<Workspace | null> => {
  const _docRef = firestore
    .collection(`version/${VERSION}/workspace`)
    .doc(workspaceId)
    .withConverter(workSpaceConverter);
  const _docSnapshot = await _docRef.get();
  const _workspace = _docSnapshot.data();
  return _workspace || null;
};

export const workSpaceConverter: FirestoreDataConverter<Workspace> = {
  toFirestore: (workspace: Workspace): DocumentData => {
    const newDoc: Partial<Workspace> = { ...workspace };
    delete newDoc.id;
    return newDoc;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<Workspace>): Workspace => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      zenkouChannelId: data.zenkouChannelId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
