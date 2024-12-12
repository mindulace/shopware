/**
 * @package admin
 *
 * @private
 */
export default function initializeNotifications(): void {
    // Handle incoming notifications from the ExtensionAPI
    Shopware.ExtensionAPI.handle('notificationDispatch', async (notificationOptions) => {
        // @ts-expect-error - t is callable
        const message = notificationOptions.message ?? Shopware.Snippet.tc('global.notification.noMessage');
        // @ts-expect-error - tc is callable
        const title = notificationOptions.title ?? Shopware.Snippet.tc('global.notification.noTitle');
        const actions = notificationOptions.actions ?? [];
        const appearance = notificationOptions.appearance ?? 'notification';
        const growl = notificationOptions.growl ?? true;
        const variant = notificationOptions.variant ?? 'info';

        await Shopware.State.dispatch('notification/createNotification', {
            variant: variant,
            title: title,
            message: message,
            growl: growl,
            actions: actions,
            system: appearance === 'system',
        });
    });
}
