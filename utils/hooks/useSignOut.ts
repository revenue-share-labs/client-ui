import { deleteCookie, getCookie } from 'cookies-next';
import AuthService from 'services/api/auth';
import { ROUTES } from 'constants/routes';
import { useRouter } from 'next/router';
import userStore from 'stores/UserStore';
import { useDisconnect } from 'wagmi';
import { useAuthStore } from 'stores/AuthStore';
import { useNotificationStore } from 'stores/NotificationStore';
import { TOKEN_COOKIE_NAME } from 'services/jwtToken';

export function useSignOut() {
    const router = useRouter();
    const { disconnect } = useDisconnect();
    const authStore = useAuthStore();

    const notificationStore = useNotificationStore();

    return async () => {
        const currentToken = getCookie(TOKEN_COOKIE_NAME);
        try {
            await AuthService.signOut(currentToken);
            authStore.setIsAuthenticated(false);
            deleteCookie(TOKEN_COOKIE_NAME);
            userStore.flushUser();
            router.push(ROUTES.HOME).then(() => {
                disconnect();
            });
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };
}
