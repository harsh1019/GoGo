import socketIo from 'socket.io';
import user from './models/UserModel.js';
import captain from './models/CaptainModel.js';


let io;

export const InitializeSocket = (server) => {
    io = socketIo(server,{
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
          }
    });

    io.on('connection', (socket) => {
        console.log(`client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const {userId, userType} = data;

            if(userType === 'user'){
                await user.findOneAndUpdate({
                    _id: userId
                },{
                    socketId: socket.id
                })

            }else if(userType === 'captain'){
                await captain.findOneAndUpdate({
                    _id: userId
                },{
                    socketId: socket.id
                })
            }
        })


        socket.on('update-location-captain', async (data) => {
            const {userId, location} = data;
            if(!location|| !location.latitude || !location.longitude){
                return socket.emit('error', {message:'Location is required'})
            }

            await captain.findOneAndUpdate({
                _id: userId
            },{
                location:{
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            })
        })

        socket.on('disconnect', async () => {
            console.log(`client disconnected: ${socket.id}`);
        })
    })
}


export const sendMessageToSocketId = (socketId, data) => {
     if(io){
        io.to(socketId).emit(data.event, data.data)
     }else{
        console.log('Socket not initialized')
     }
}

