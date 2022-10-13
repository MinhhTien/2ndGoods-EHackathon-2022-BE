require("dotenv").config()

exports.APPLICATION_PORT = process.env.APPLICATION_PORT || 3000
exports.DATABASE_NAME = process.env.DATABASE_NAME || 'test'
exports.ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'root'
exports.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
exports.ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || 'Admin'
exports.IMAGE_PATH = process.env.IMAGE_PATH || 'public/uploads/'