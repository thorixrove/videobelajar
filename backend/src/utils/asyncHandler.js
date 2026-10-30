// Express 4 tidak menangkap error dari fungsi async secara otomatis.
// Pembungkus ini meneruskan error apa pun ke error handler di app.js.
export default function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}