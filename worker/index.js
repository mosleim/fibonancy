// import keys from './keys.js';
const keys = require('./keys.js')
const redis = require('redis')

// import redis from 'redis';

const redisClient = redis.createClient(
    {
        host: keys.redisHost,
        port: keys.redisPort,
        retry_strategy: ()=> 1000
    }
);

const sub = redisClient.duplicate();

function fib(index) {
    if(index<2) return 1;
    return fib(index-1) + fib(index-2);
}
console.log("selamat malam");

sub.on('message', (channel, message)=>{ 
    console.log("new message");
    redisClient.hset('values', 
                        message, 
                        fib(parseInt(message))
                        );
    }
);
redisClient.on('error', function(err){ 
    console.error('Redis error:', err); 
  });
sub.on('error', function(err){ 
    console.error('Redis error:', err); 
  });
sub.subscribe('insert');