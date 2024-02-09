export const TOKEN_KEY = 'token';

export class Roles {
  static readonly ADMIN = 'ADMIN';
  static readonly MODERATOR = 'MODERATOR';
  static readonly GUEST = 'GUEST';
}

export const STATE_IN_PROCESS = 'IN_PROCESS';
export const STATE_CANCELLED = 'CANCELLED';
export const STATE_COMPLETED = 'COMPLETED';

export class TransactionState {
  static readonly IN_PROCESS = STATE_IN_PROCESS;
  static readonly CANCELLED = STATE_CANCELLED;
  static readonly COMPLETED = STATE_COMPLETED;
}
