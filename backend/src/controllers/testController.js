const getTestMessage = (req, res) => {
  res.json({
    success: true,
    message: 'Frontend connected to backend successfully'
  });
};

module.exports = {
  getTestMessage
};
