// Когда нет next() делаем кастомный обработчик ошибок

class ErrorHandler extends Error {
  constructor(status, message, data = null) {
  // Поскольку мы екстендим от Error надо вызвать super() - инициализировать сам Error
    super()
    this.status = status
    this.message = message
    this.data = data
  }
}

module.exports = {
  ErrorHandler,
}
