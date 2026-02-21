export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  console.error(`[${status}] ${message}`, err.stack || '');
  res.status(status).json({ success: false, message });
};