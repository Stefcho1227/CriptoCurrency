import React from 'react';
import Wavify from 'react-wavify';

function WaveBackground() {
    return (
        <div style={styles.waveContainer}>
            <Wavify
                fill="#8A56FF"
                paused={false}
                options={{
                    height: 40,
                    amplitude: 30,
                    speed: 0.2,
                    points: 3
                }}
            />
        </div>
    );
}

const styles = {
    waveContainer: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '300px',
        transform: 'translateY(140px)',
        zIndex: 0,
        overflow: 'hidden'
    }
};

export default WaveBackground;
