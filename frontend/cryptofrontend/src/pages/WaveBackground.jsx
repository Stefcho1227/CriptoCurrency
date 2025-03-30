// WaveBackground.jsx
import React from 'react';
import Wavify from 'react-wavify';

function WaveBackground() {
    return (
        <div style={styles.waveContainer}>
            <Wavify
                fill="#8A56FF"
                paused={false}
                options={{
                    height: 40,      // amplitude
                    amplitude: 30,   // wave variation
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
        // Height for the wave container
        height: '300px',
        // Shift the wave down using transform:
        transform: 'translateY(140px)',
        zIndex: 0,         // behind main content
        overflow: 'hidden' // avoid horizontal scrollbars
    }
};

export default WaveBackground;
