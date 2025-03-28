import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [topCryptos, setTopCryptos] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchTop20 = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cryptos/top20');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setTopCryptos(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching top 20 cryptos:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTop20();

        const intervalId = setInterval(fetchTop20, 60000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <div>Loading cryptocurrency data...</div>;
    }

    return (
        <div>
            <h1>Top 20 Cryptocurrencies</h1>
            <table>
                <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(topCryptos).map(([symbol, price]) => (
                    <tr key={symbol}>
                        <td>{symbol.includes('/') ? symbol.substring(0, symbol.indexOf('/')) : symbol}</td>
                        <td>{price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;