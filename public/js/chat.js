const socket=io()

//Elements

const $messageForm=document.querySelector('#message-form')
const $messageFormInput=document.querySelector('input')
const $messageFormButton=document.querySelector('button')
const $messages=document.querySelector('#messages')

//Templates

const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//options

const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

//Auto Scroll Functionality

// const autoScroll=()=>{

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height of a screen
    const visibleHeight = $messages.offsetHeight

    // Total Height of messages container
    const containerHeight = $messages.scrollHeight

    // How much we have scrolles
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

const $locationButton=document.querySelector('#send-location')
socket.on('message',(message)=>{

    const html = Mustache.render(messageTemplate, {
       username:message.username,
        message:message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
// console.log(message)
})

socket.on('locationMessage',(message)=>{
    const html=Mustache.render(locationMessageTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    //console.log(url)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
 const html=Mustache.render(sidebarTemplate,{
     room,
     users
 })
 document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value
    socket.emit('sendMesage',message,(error)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })

})
$locationButton.addEventListener('click',()=>{
    if (!navigator.geolocation)
    {
        alert('Geolocation is not supported by your browser!!')
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
           

        }, ()=>{
            console.log('Location shared')
            $locationButton.removeAttribute('disabled')
        })
    })
})

// socket.emit('join',{username,room},(error)=>{
    
// })

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})