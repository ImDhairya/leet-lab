function asyncHandler(requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(function (err) {
      next(err);
    });
  };
}

export {asyncHandler};
