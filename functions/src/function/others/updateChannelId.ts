import { findWorkspace, updateWorkspace } from '../repository/workspace';

export const updateChannelId = async (workspaceId: string, channelId: string): Promise<void> => {
  const workspace = await findWorkspace(workspaceId);
  if (!workspace) {
    throw new Error('workspace not found');
  }
  workspace.zenkouChannelId = channelId;
  await updateWorkspace(workspace);
};
