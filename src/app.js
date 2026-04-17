const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// 1. Cấu hình Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL của Vite
    credentials: true
  }
});

// 2. Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // Quan trọng để nhận/gửi Cookie
}));
app.use(express.json());
app.use(cookieParser());

// 3. Socket.io Event (Xử lý đơn hàng real-time)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('new_order', (data) => {
    // Thông báo cho tất cả admin/staff
    io.emit('admin_notification', { message: "Có đơn hàng mới!", order: data });
  });
});

// 4. Tuyến đường API mẫu
app.get('/', (req, res) => {
  res.send('Canteen API is running...');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});