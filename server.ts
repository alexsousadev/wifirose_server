import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;

let positions: any[] = [];

app.use(express.json());
app.set("view engine", "ejs");

app.get('/', (req: Request, res: Response) => {
    res.render("rose", { positions: positions });
});

app.post("/position", (req: Request, res: Response) => {
    console.log("Recebido:", req.body);
    positions.push(req.body);
    io.emit('newPosition', req.body); // Emite a nova posição para todos os clientes
    res.send({ status: "ok" });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('Um cliente conectou');
    socket.emit('initialPositions', positions); // Envia posições existentes para novo cliente
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});