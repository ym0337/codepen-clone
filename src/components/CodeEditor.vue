<template>
  <div class="editor-container">
    <div class="editor">
      <codemirror
        v-model:value="code"
        :options="cmOptions"
        border
        ref="cmRef"
        height="400"
        width="600"
      />
    </div>
    <div class="preview">
      <button @click="runCode">Run Code</button>
      <button @click="formatCode">Format Code</button>
      <div v-if="output">{{ output }}</div>
      <div v-if="error" style="color: red">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import prettier from "prettier";
import parserBabel from "prettier/parser-babel";

let code = ref(
  '// Write your code here\nconsole.log("Hello, CodePen Clone!");'
);
const cmOptions = {
  mode: "javascript",
  theme: "material",
  lineNumbers: true,
};
const output = ref("");
const error = ref("");

const runCode = () => {
  const worker = new Worker(new URL("../worker.js", import.meta.url));
  worker.onmessage = (event) => {
    const { result, error: workerError } = event.data;
    if (workerError) {
      error.value = workerError;
      output.value = "";
    } else {
      output.value = result;
      error.value = "";
    }
    worker.terminate();
  };
  worker.postMessage(code.value);
};

const formatCode = () => {
  try {
    const formattedCode = prettier.format(code.value, {
      parser: "babel",
      plugins: ['javascript'],
    });
    code.value = formattedCode;
    error.value = "";
  } catch (formatError) {
    console.warn('Error formatting code:')
    error.value = formatError.message;
  }
};
</script>

<style>
.editor-container {
  display: flex;
  height: 100vh;
}
.editor {
  flex: 1;
  border-right: 1px solid #ddd;
}
.preview {
  flex: 1;
  padding: 10px;
}
</style>
