/**
 * Judge Passcode Authentication Manager
 */

const CORRECT_PASSCODE = 'judge2026';

export const Auth = {
    /**
     * Check if the current user is logged in as a judge
     * @returns {boolean}
     */
    isJudge() {
        return localStorage.getItem('isJudge') === 'true';
    },

    /**
     * Attempt to log in with a passcode
     * @param {string} passcode 
     * @returns {boolean} True if successful, false otherwise
     */
    login(passcode) {
        if (passcode === CORRECT_PASSCODE) {
            localStorage.setItem('isJudge', 'true');
            return true;
        }
        return false;
    },

    /**
     * Log out and clear the session
     */
    logout() {
        localStorage.removeItem('isJudge');
    }
};
