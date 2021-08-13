const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filters=require('bad-words')
const { callbackify } = require('util')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom}= require('./utils/users')


const app=express()
const server=http.createServer(app)
const io=socketio(server)




const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))

// let count=0

io.on('connection',(socket)=>{
    console.log('new socketio server created')

     

    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
         if(error)
         {
             return callback(error)
         }
        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined the Chat!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        }) 
        callback()
    })
     
     socket.on('sendMesage',(message,callback)=>{
         const user=getUser(socket.id)
        const filert=new Filters()
        if(filert.isProfane(message))
        {
            return callback('Profinity is not allowed')
        }

    //  io.emit('message',generateMessage(message),)

    io.to(user.room).emit('message',generateMessage(user.username,message))
     callback()

     })
     socket.on('sendLocation',(coords,callback)=>{
         const user=getUser(socket.id)
         io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
         callback()
     })

   
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
    })
 
})


server.listen(port,()=>{
    console.log(`App is up and running in port ${port} !!`)
})
