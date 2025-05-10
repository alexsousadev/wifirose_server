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

// Mudar de POST para GET e usar req.query ao invés de req.body
app.get("/position", (req: Request, res: Response) => {
    const position = {
        position_x: parseInt(req.query.x as string),
        position_y: parseInt(req.query.y as string)
    };
    console.log("Recebido:", position);
    positions.push(position);
    io.emit('newPosition', position);
    res.send({ status: "ok" });
});

// Rota para deupuração
app.get('/get-pos', (req, res) => {
    console.log("teste...");
    res.json({ message: 'Retornando posição' });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('Um cliente conectou');
    socket.emit('initialPositions', positions); // Envia posições existentes para novo cliente
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
