export interface SlackOAuthResponse {
  ok: boolean;
  app_id: string;
  authed_user: AuthedUser;
  scope: string;
  token_type: string;
  access_token: string;
  bot_user_id: string;
  team: Team;
  enterprise?: null;
  is_enterprise_install: boolean;
}
interface AuthedUser {
  id: string;
}

export interface SlashCommandRequestBody {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: string;
  response_url: string;
  trigger_id: string;
}

export interface InteractionRequestBody {
  type: string;
  team: Team;
  user: SlackUser;
  api_app_id: string;
  token: string;
  trigger_id: string;
  view?: View;
  response_urls?: null[] | null;
  is_enterprise_install: boolean;
  enterprise?: null;
  container?: Container;
  channel?: Channel;
  message?: Message;
  state?: State;
  response_url?: string;
  actions?: ActionsEntity[] | null;
}

export interface ChallengeEventRequestBody {
  token: string;
  challenge: string;
  type: string;
}

export interface BaseEventRequestBody {
  token: string;
  team_id: string;
  api_app_id: string;
  event: Event;
  type: string;
  event_id: string;
  event_time: number;
  authed_users: string[];
}

interface Event {
  type: string;
  user: string;
  text: string;
  ts: string;
  channel: string;
  event_ts: string;
  channel_type: string;
}

interface SlackUser {
  id: string;
  username: string;
  name: string;
  team_id: string;
}
interface Container {
  type: string;
  message_ts: string;
  channel_id: string;
  is_ephemeral: boolean;
}
interface Team {
  id: string;
  domain: string;
}
interface Channel {
  id: string;
  name: string;
}
interface Message {
  user: string;
  type: string;
  ts: string;
  bot_id: string;
  app_id: string;
  text: string;
  team: string;
  blocks?: string[] | null;
}
interface State {
  values: object;
}
interface ActionsEntity {
  action_id: string;
  block_id: string;
  text: string;
  value: string;
  type: string;
  action_ts: string;
}

interface View {
  id: string;
  team_id: string;
  type: string;
  blocks?: string[] | null;
  private_metadata: string;
  callback_id: string;
  state: State;
  hash: string;
  title: TitleOrCloseOrSubmit;
  clear_on_close: boolean;
  notify_on_close: boolean;
  close: TitleOrCloseOrSubmit;
  submit: TitleOrCloseOrSubmit;
  previous_view_id?: null;
  root_view_id: string;
  app_id: string;
  external_id: string;
  app_installed_team_id: string;
  bot_id: string;
}

interface TitleOrCloseOrSubmit {
  type: string;
  text: string;
  emoji: boolean;
}

export interface ModalInputValues {
  zen_user?: {
    'users_select-action'?: {
      selected_user: string;
    };
  };
  posted_channel?: {
    channel_input?: {
      value: string;
    };
  };
  zen_content?: {
    'plain_text_input-action'?: {
      value: string;
    };
  };
}
