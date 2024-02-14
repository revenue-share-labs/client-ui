import React from 'react';

type BackIconProps = {
    width: string;
    height: string;
}

const BackIcon = ({ width, height } : BackIconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.1446 5.95711C12.5351 5.56658 12.5351 4.93342 12.1446 4.54289C11.7541 4.15237 11.1209 4.15237 10.7304 4.54289L3.98039 11.2929C3.58987 11.6834 3.58987 12.3166 3.98039 12.7071L10.7304 19.4571C11.1209 19.8476 11.7541 19.8476 12.1446 19.4571C12.5351 19.0666 12.5351 18.4334 12.1446 18.0429L7.10171 13H19.3125C19.8648 13 20.3125 12.5523 20.3125 12C20.3125 11.4477 19.8648 11 19.3125 11H7.10171L12.1446 5.95711Z" fill="white" />
        </svg>
    );
};

export default BackIcon;
