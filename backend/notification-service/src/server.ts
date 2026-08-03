import app from './app';
const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});
