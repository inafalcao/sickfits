import { permissionsList } from './schemas/files';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

// Permissions check if someone meets a criteria - yes or no
const generatePermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatePermissions,
};

// Rules can return a boolean - yes or no - or a filter which limits
// which entity they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    // This will bind to a where graphql api clause
    // Return a where filter
    // If it does not find anything, means FALSE
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageCart({ session })) {
      return true;
    }

    // This will bind to a where graphql api clause
    // Return a where filter
    // If it does not find anything, means FALSE
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (permissions.canManageCart({ session })) {
      return true;
    }

    // This will bind to a where graphql api clause
    // Return a where filter
    // If it does not find anything, means FALSE
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) {
      return true;
    }

    return { status: 'AVAILABLE' };
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageUsers({ session })) {
      return true;
    }

    // They may only update themselves.
    return { id: session.itemId };
  },
};
