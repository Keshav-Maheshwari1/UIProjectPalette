import express from "express";
import http from "http";
import { Server } from "socket.io";
import { spawn } from "child_process";
import fs from "fs";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let processCode;

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("code", (code) => {
    const language = code.lang.toLowerCase();
    const type = code.type;
    const filename = code.file;
    let syntax = code.code;

    if (type === "run") {
      handleCodeExecution(language, syntax, filename, type);
    } else {
      io.emit("code", code);
    }
  });

  socket.on("input", (input) => {
    if (processCode && processCode.stdin) {
      processCode.stdin.write(`${input}\n`);
    }
  });

  socket.on("disconnect", () => {
    if (processCode) {
      processCode.kill();
    }
  });
});

function handleCodeExecution(language, syntax, filename, type) {
  const lowerCaseLanguage = language.toLowerCase();

  switch (lowerCaseLanguage) {
    case "python":
      executePython(syntax, filename, type, language);
      break;
    case "java":
      executeJava(syntax, filename, type, language);
      break;
    case "c":
      executeC(syntax, filename, type, language);
      break;
    case "c++":
      executeCpp(syntax, filename, type, language);
      break;
    case "rust":
      executeRust(syntax, filename, type, language);
      break;
    default:
      io.emit("code", {
        lang: language,
        code: `Execution not supported for language: ${language}`,
        type: type,
        file: filename,
      });
      break;
  }
}

function executePython(syntax, filename, type, language) {
  processCode = spawn("python", ["-c", syntax]);
  handleProcessOutput(language,filename, type);
}

function executeJava(code, filename, type, language) {
  const fileName = `Main.java`;

  try {
    fs.writeFileSync(fileName, code);
    const compileprocessCode = spawn("javac", [fileName]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        processCode = spawn("java", ["Main"]);
        handleProcessOutput(language, filename, type);
        cleanupFiles(["Main.java", "Main.class"]);
      } else {
        io.emit("code", {
          lang: language,
          code: "Java compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type);
  }
}

function executeC(code, filename, type, language) {
  const fileC = `${filename}.c`;
  const outputFileName = "a.out";

  try {
    fs.writeFileSync(fileC, code);
    const compileprocessCode = spawn("gcc", [fileC, "-o", outputFileName]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        processCode = spawn(`./${outputFileName}`);
        handleProcessOutput(language, filename, type);
        cleanupFiles([fileC, outputFileName]);
      } else {
        io.emit("code", {
          lang: language,
          code: "C compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type);
  }
}

function executeCpp(code, filename, type, language) {
  const fileCpp = `${filename}.cpp`;
  const outputFile = "a.out";

  try {
    fs.writeFileSync(fileCpp, code);
    const compileprocessCode = spawn("g++", [fileCpp, "-o", outputFile]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        processCode = spawn(`./${outputFile}`);
        handleProcessOutput(language, filename, type);
        cleanupFiles([fileCpp, outputFile]);
      } else {
        io.emit("code", {
          lang: language,
          code: "C++ compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type);
  }
}

function executeRust(code, filename, type, language) {
  const fileRust = `${filename}.rs`;
  const outputFileRust = `${filename}.out`;

  try {
    fs.writeFileSync(fileRust, code);
    const compileprocessCode = spawn("rustc", ["-o", outputFileRust, fileRust]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        processCode = spawn(`./${outputFileRust}`);
        handleProcessOutput(language, filename, type);
        cleanupFiles([fileRust, outputFileRust]);
      } else {
        io.emit("code", {
          lang: language,
          code: "Rust compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type);
  }
}

function handleProcessOutput(language, filename, type) {
  processCode.stdout.setEncoding("utf-8");
  processCode.stderr.setEncoding("utf-8");

  processCode.stdout.on("data", (data) => {
    const output = data.toString();
    io.emit("code", {
      lang: language,
      code: `${output}`,
      type: "close",
      file: filename,
    });
  });

  processCode.stderr.on("data", (data) => {
    handleError(data, language, filename, type);
    clearInterval(checkProcessRunning);
  });

  processCode.on("exit", (code) => {
    console.log(`About to exit with code: ${code}`);
    io.emit("code", {
      lang: language,
      code: "",
      type: "close",
      file: filename,
    });
    clearInterval(checkProcessRunning);
    processCode = null;
  });

  processCode.on("close", (code) => {
    console.log(`${language} processCode exited with code ${code}`);
    clearInterval(checkProcessRunning);
    processCode = null;
  });

  const checkProcessRunning = setInterval(() => {
    if (processCode) {
      io.emit("code", {
        lang: language,
        code: "",
        type: "info",
        file: filename,
      });
    } else {
      clearInterval(checkProcessRunning);
    }
  }, 1000);

  setTimeout(() => {
    if (processCode && !processCode.killed) {
      console.log("Entered in timeout");
      processCode.stdin.end();
    }
  }, 100000);
}

function handleError(data, language, filename, type) {
  console.error("Error: " + data);
  const error = data.toString();
  io.emit("code", {
    lang: language,
    code: error,
    type: type,
    file: filename,
  });
}

function cleanupFiles(files) {
  files.forEach((file) => {
    try {
      fs.unlinkSync(file);
      console.log(`Deleted ${file}`);
    } catch (err) {
      console.error(`Error deleting file ${file}:`, err);
    }
  });
}
server.listen(3001, () => {
  console.log("Running on port 3001");
});
