export const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid id' });
  }
  if (err.name === 'ValidationError') {
    const msg =
      Object.values(err.errors || {})
        .map((e) => e.message)
        .join(', ') || 'Validation failed';
    return res.status(400).json({ success: false, message: msg });
  }
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  console.error(`[${status}] ${message}`, err.stack || '');
  res.status(status).json({ success: false, message });
};