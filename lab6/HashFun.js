export default function HashFun(message, h0, n) {
  if (typeof message === "string") {
    message = message.split("").map((ch) => {
      return ch.charCodeAt(0);
    });
  }

  let h = h0;

  message.forEach((ch) => {
    h = (h + ch) ** 2 % n;
  });

  return h;
}
