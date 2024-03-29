export const TOKEN_KEY = 'token';
export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const PATCH = 'patch';
export const DELETE = 'delete';

export class Role {
  static readonly ADMIN = 'ADMIN';
  static readonly MODERATOR = 'MODERATOR';
  static readonly GUEST = 'GUEST';
}

export class TransactionState {
  static readonly IN_PROGRESS = 'IN_PROGRESS';
  static readonly CANCELLED = 'CANCELLED';
  static readonly COMPLETED = 'COMPLETED';
}

export const ADMIN_MENU_ITEMS: string[] = ['dashboard', 'donations', 'donators', 'users',  'servers'];
export const MODERATOR_MENU_ITEMS: string[] = ['donations'];
