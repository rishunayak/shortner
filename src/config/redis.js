import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'hcsbUfiwMx9hZnTf4C5OLDtOuGCOKjkf',
    socket: {
        host: 'redis-19680.c17.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 19680
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

