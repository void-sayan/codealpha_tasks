function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, _next) {
  console.error(error);
  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: Object.values(error.errors).map(item => item.message) });
  }
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid resource id' });
  if (error.code === 11000) return res.status(409).json({ message: 'A record with that value already exists' });
  const status = error.statusCode || 500;
  res.status(status).json({ message: status === 500 ? 'Internal server error' : error.message });
}

module.exports = { notFound, errorHandler };
