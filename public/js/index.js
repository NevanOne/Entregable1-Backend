const socket = io();
socket.emit('message', 'Hola ! Me comunico desde un websocket')
socket.on('evento_para_socket_individual',data=>{
    console.log(data);
})

socket.on('evento_para_todos_menos_el_socket_actual',data=>{
    console.log(data);
})
socket.on('evento_para_todos',data=>{
    console.log(data);
})