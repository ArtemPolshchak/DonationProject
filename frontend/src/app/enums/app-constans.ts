export const TOKEN_KEY = 'token';
export const ROLE_ADMIN = 'ADMIN';
export const ROLE_MODERATOR = 'MODERATOR';
export const ROLE_GUEST = 'GUEST';

export class Roles {
  static readonly ADMIN = ROLE_ADMIN;
  static readonly MODERATOR = ROLE_MODERATOR;
  static readonly GUEST = ROLE_GUEST;
}

export const STATE_IN_PROCESS = 'IN_PROCESS';
export const STATE_CANCELLED = 'CANCELLED';
export const STATE_COMPLETED = 'COMPLETED';

export class TransactionState {
  static readonly IN_PROCESS = STATE_IN_PROCESS;
  static readonly CANCELLED = STATE_CANCELLED;
  static readonly COMPLETED = STATE_COMPLETED;
}
