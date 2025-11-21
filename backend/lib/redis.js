import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

let client = null;
let isConnected = false;

const connectRedis = async () => {
    if (isConnected || !process.env.REDIS_URI) {
        return client;
    }
    
    try {
        client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_URI,
                port: process.env.REDIS_PORT,
            }
        });
        
        client.on('error', (err) => {
            console.warn('⚠️ Redis connection failed, continuing without cache:', err.message);
            isConnected = false;
        });
        
        await client.connect();
        isConnected = true;
        console.log('✅ Redis connected');
    } catch (error) {
        console.warn('⚠️ Redis unavailable, continuing without cache');
        client = null;
        isConnected = false;
    }
    
    return client;
};

// Export both client and connection function
export { connectRedis };
export default client;
 

