// src/worker.js
self.onmessage = function (event) {
  console.log(event,'worker message')
  const code = event.data;
  try {
    const result = eval(code);
    self.postMessage({ result: result?.toString(), error: null });
  } catch (error) {
    self.postMessage({ result: null, error: error.toString() });
  }
};
