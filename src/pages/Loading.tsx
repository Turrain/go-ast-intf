import React from 'react';
import { useAuthStore } from '../store/AuthStore';

const Loading: React.FC = () => {
    const { user, loading } = useAuthStore();
    React.useEffect(() => {
        window.location.reload();
    }, [loading]);
    return (
        <div>
            <h2>Loading...</h2>
        </div>
    );
};

export default Loading;