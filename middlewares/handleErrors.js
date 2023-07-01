function handleErrors(err, req, res) {
  res.status(err.statusCode).send({ message: err.message });
}

module.exports = handleErrors;
