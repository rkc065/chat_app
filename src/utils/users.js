const users=[]

//creating the function

const addUser=({id,username,room})=>{

    //Clean the user provided data
 username=username.trim().toLowerCase()
 room=room.trim().toLowerCase()

//Validate the user and Room
 if(!username || !room)
 {
    return{
        error:'Username and Room are required!!'
    }
 }

 const existingUser=users.find((user)=>{
        return user.room === room && user.username===username
 })
 //Validate Existing user

  if(existingUser){
      return{
          error:'User Name is in use!'
      }
  }
  //Store User
      const user={id,username,room}
      users.push(user)
      return {user}
}


const removeUser=(id)=>{
         const index=users.findIndex((user)=>user.id===id)

         if(index!==-1)
         {
            return users.splice(index,1)[0]
         }
}


const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}

const getUserInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}