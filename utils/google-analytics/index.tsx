import TagManager from 'react-gtm-module';

const tagManagerArgs = {
    gtmId: 'GTM-NDC83R7',
};

const initializeGoogleAnalytics = () => {
    TagManager.initialize(tagManagerArgs);
};

const TrackGoogleAnalyticsEvent = (event: string, value?: string) => {
    window.dataLayer.push({
        event,
        value,
    });
};

export default initializeGoogleAnalytics;
export { initializeGoogleAnalytics, TrackGoogleAnalyticsEvent };
