import universeIcon from 'public/icons/universe.svg';
import lockClosedIcon from 'public/icons/lock-closed-white.svg';
import logoTwitter from 'public/icons/logo-twitter.svg';
import logoFacebook from 'public/icons/logo-facebook.svg';
import logoDiscord from 'public/icons/logo-discord.svg';

export const shareList = [
    {
        value: 'Anyone with the link can view',
        label: 'Anyone with the link can view',
        icon: universeIcon,
    },
    {
        value: 'Only the recipients can view',
        label: 'Only the recipients can view',
        icon: lockClosedIcon,
    },
];

export const socialList = [
    {
        value: 'twitter',
        label: 'Twitter',
        icon: logoTwitter,
    },
    {
        value: 'facebook',
        label: 'Facebook',
        icon: logoFacebook,
    },
    {
        value: 'discord',
        label: 'Discord',
        icon: logoDiscord,
    },
];

export const labelTooltip = 'The contract will appear in the community section. All users can see it there.';
