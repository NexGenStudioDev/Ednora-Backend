import io from './config/Socket/SocketServer.mjs';
import express from 'express';
import app from './routes/app.mjs';
import envConstant from './constant/env.constant.mjs';
import path from 'path';
import cookieParser from 'cookie-parser';
import lolcat from 'lolcatjs';
import rabbitMQService from './service/rabbitmq.service.mjs';
import SocketEvent from './config/Socket/SocketEvent.mjs';
import Socket_Middleware from './config/Socket/SocketMiddleWare.mjs';

app.use(cookieParser());

// System health probe
app.get('/api/health', (req, res) => {
  const queueStats = rabbitMQService.getStats();
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: 'resilient',
      rabbitmq: queueStats.mode,
      port: 3000,
    },
    queues: queueStats,
  });
});

app.get('/', (req, res) => {
 
    res.status(200).json({
      name: 'Eduvanta Backend API Engine',
      tagline: 'Where Knowledge Finds Its Future.',
      status: 'online',
      port: 3000,
      timestamp: new Date().toISOString(),
    });
  
});

app.use((req, res, next) => {
  console.log('METHOD :', req.method);
  console.log('URL :', req.url);
  console.log('ORIGIN :', req.headers.origin);
  next();
});

app.use(express.static(path.join(path.resolve(), 'public')));
app.use(
  '/api/images',
  express.static(path.join(path.resolve(), 'public', 'images'))
);
app.use(
  '/api/upload',
  express.static(path.join(path.resolve(), 'public', 'upload'))
);

app.use((req, res, next) => {
  envConstant.isDevelopment
    ? lolcat.fromString(
        `\n${req.method} ${req.url} \n${new Date().toLocaleString()}\n`
      )
    : console.log(
        `\n${req.method} ${req.url} \n${new Date().toLocaleString()}\n`
      );

  next();
});

io.on('connection', (socket) => SocketEvent(socket));
io.use((socket, next) => Socket_Middleware(socket, next));

app.use((err, req, res, next) => {

  if (err) {
    console.error(err.stack || err);
    return res
      .status(err.status || 500)
      .json({ error: err.message || 'Something broke!' });
  }

  next();
});
