// lib/roles.js

export const ROLES = {
    ADMIN: 'admin',
    STUDENT: 'student'
};

/**
 * Check if user is admin based on email or custom field
 * In production, use Stack's custom user fields or a proper role system
 */
export function getUserRole(user) {
    if (!user) return null;

    // Option 1: Check by email (current approach - not recommended for production)
    if (user.primaryEmail === 'admin@admin.com') {
        return ROLES.ADMIN;
    }

    // Option 2: Use Stack's custom user fields (RECOMMENDED)
    // if (user.clientMetadata?.role === 'admin') {
    //   return ROLES.ADMIN;
    // }

    return ROLES.STUDENT;
}

export function isAdmin(user) {
    return getUserRole(user) === ROLES.ADMIN;
}

export function isStudent(user) {
    return getUserRole(user) === ROLES.STUDENT;
}