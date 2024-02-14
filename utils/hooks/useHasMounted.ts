import { useEffect, useState } from 'react';

// This hook for separating UI depending on the browser from the one that could be rendered on the server
export function useHasMounted() {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}
