class UserDto {
    constructor(user){
        this.full_name  = `${user.first_name} ${user.last_name}`
        this.first_name = user.first_name
        this.last_name  = user.last_name
        this.email      = user.email
        this.password   = user.password
        
    }
}

// Modificar la ruta /current para enviar un DTO del usuario
router.get('/current', authenticateToken, async (req, res) => {
    try {
        // Obtener el usuario actual del objeto req.user
        const { id, email, roles } = req.user;

        // Crear un DTO del usuario con la información necesaria
        const userDTO = new UserDTO(id, email, roles);

        // Enviar el DTO del usuario como respuesta
        res.json(userDTO);
    } catch (error) {
        // Manejar errores si ocurrieron
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = {
    UserDto
}