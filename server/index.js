// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { spawn } from "child_process";
// import fs from "fs";
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// let processCode;

// io.on("connection", (socket) => {
//   console.log("connected");

//   socket.on("code", (code) => {
//     const language = code.lang;
//     const type = code.type;
//     const filename = code.file;
//     let syntax = code.code;
//     console.log(filename + "now i am here");
//     if (type === "run") {
//       handleCodeExecution(language, syntax, filename, type);
//     } else {
//       io.emit("send", code);
//     }
//   });

//   socket.on("input", (input) => {
//     if (processCode && processCode.stdin) {
//       processCode.stdin.write(`${input}\n`);
//     }
//   });

//   socket.on("disconnect", () => {
//     if (processCode) {
//       processCode.kill();
//     }
//   });
// });

// function handleCodeExecution(language, syntax, filename, type) {
//   const lowerCaseLanguage = language.toLowerCase();

//   switch (lowerCaseLanguage) {
//     case "python":
//       executePython(syntax, filename, type, language);
//       break;
//     case "java":
//       executeJava(syntax, filename, type, language);
//       break;
//     case "c":
//       executeC(syntax, filename, type, language);
//       break;
//     case "cpp":
//       executeCpp(syntax, filename, type, language);
//       break;
//     case "rust":
//       executeRust(syntax, filename, type, language);
//       break;
//     default:
//       io.emit("code", {
//         lang: language,
//         code: `Execution not supported for language: ${language}`,
//         type: type,
//         file: filename,
//       });
//       break;
//   }
// }

// function executePython(syntax, filename, type, language) {
//   processCode = spawn("python", ["-c", syntax]);
//   handleProcessOutput(language, filename, type);
// }

// function executeJava(code, filename, type, language) {
//   console.log(code);
//   try {
//     fs.writeFileSync(filename, code);
//     const compileprocessCode = spawn("javac", [filename]);

//     compileprocessCode.stderr.on("data", (data) => {
//       handleError(data, language, filename, type);
//     });

//     compileprocessCode.on("close", (code) => {
//       if (code === 0) {
//         processCode = spawn("java", ["Main"]);
//         handleProcessOutput(language, filename, type);
//         cleanupFiles(["Main.java", "Main.class"]);
//       } else {
//         io.emit("code", {
//           lang: language,
//           code: "Java compilation failed",
//           type: type,
//           file: filename,
//         });
//       }
//     });
//   } catch (err) {
//     handleError(err, language, filename, type);
//   }
// }

// function executeC(code, filename, type, language) {
//   const fileC = `${filename}.c`;
//   const outputFileName = "a.out";

//   try {
//     fs.writeFileSync(fileC, code);
//     const compileprocessCode = spawn("gcc", [fileC, "-o", outputFileName]);

//     compileprocessCode.stderr.on("data", (data) => {
//       handleError(data, language, filename, type);
//     });

//     compileprocessCode.on("close", (code) => {
//       if (code === 0) {
//         processCode = spawn(`./${outputFileName}`);
//         handleProcessOutput(language, filename, type);
//         cleanupFiles([fileC, outputFileName]);
//       } else {
//         io.emit("code", {
//           lang: language,
//           code: "C compilation failed",
//           type: type,
//           file: filename,
//         });
//       }
//     });
//   } catch (err) {
//     handleError(err, language, filename, type);
//   }
// }

// function executeCpp(code, filename, type, language) {
//   const fileCpp = `${filename}.cpp`;
//   const outputFile = "a.out";

//   try {
//     fs.writeFileSync(fileCpp, code);
//     const compileprocessCode = spawn("g++", [fileCpp, "-o", outputFile]);

//     compileprocessCode.stderr.on("data", (data) => {
//       handleError(data, language, filename, type);
//     });

//     compileprocessCode.on("close", (code) => {
//       if (code === 0) {
//         processCode = spawn(`./${outputFile}`);
//         handleProcessOutput(language, filename, type);
//         cleanupFiles([fileCpp, outputFile]);
//       } else {
//         io.emit("code", {
//           lang: language,
//           code: "C++ compilation failed",
//           type: type,
//           file: filename,
//         });
//       }
//     });
//   } catch (err) {
//     handleError(err, language, filename, type);
//   }
// }

// function executeRust(code, filename, type, language) {
//   const fileRust = `${filename}.rs`;
//   const outputFileRust = `${filename}.out`;

//   try {
//     fs.writeFileSync(fileRust, code);
//     const compileprocessCode = spawn("rustc", ["-o", outputFileRust, fileRust]);

//     compileprocessCode.stderr.on("data", (data) => {
//       handleError(data, language, filename, type);
//     });

//     compileprocessCode.on("close", (code) => {
//       if (code === 0) {
//         processCode = spawn(`./${outputFileRust}`);
//         handleProcessOutput(language, filename, type);
//         cleanupFiles([fileRust, outputFileRust]);
//       } else {
//         io.emit("code", {
//           lang: language,
//           code: "Rust compilation failed",
//           type: type,
//           file: filename,
//         });
//       }
//     });
//   } catch (err) {
//     handleError(err, language, filename, type);
//   }
// }

// function handleProcessOutput(language, filename, type) {
//   processCode.stdout.setEncoding("utf-8");
//   processCode.stderr.setEncoding("utf-8");

//   processCode.stdout.on("data", (data) => {
//     const output = data.toString();
//     io.emit("code", {
//       lang: language,
//       code: `${output}`,
//       type: "close",
//       file: filename,
//     });
//   });

//   processCode.stderr.on("data", (data) => {
//     handleError(data, language, filename, type);
//     clearInterval(checkProcessRunning);
//   });

//   processCode.on("exit", (code) => {
//     console.log(`About to exit with code: ${code}`);
//     io.emit("code", {
//       lang: language,
//       code: "",
//       type: "close",
//       file: filename,
//     });
//     clearInterval(checkProcessRunning);
//     processCode = null;
//   });

//   processCode.on("close", (code) => {
//     console.log(`${language} processCode exited with code ${code}`);
//     clearInterval(checkProcessRunning);
//     processCode = null;
//   });

//   const checkProcessRunning = setInterval(() => {
//     if (processCode) {
//       io.emit("code", {
//         lang: language,
//         code: "",
//         type: "info",
//         file: filename,
//       });
//     } else {
//       clearInterval(checkProcessRunning);
//     }
//   }, 1000);

//   setTimeout(() => {
//     if (processCode && !processCode.killed) {
//       console.log("Entered in timeout");
//       processCode.stdin.end();
//     }
//   }, 100000);
// }

// function handleError(data, language, filename, type) {
//   console.error("Error: " + data);
//   const error = data.toString();
//   io.emit("error", {
//     lang: language,
//     code: error,
//     type: type,
//     file: filename,
//   });
// }

// function cleanupFiles(files) {
//   files.forEach((file) => {
//     try {
//       fs.unlinkSync(file);
//       console.log(`Deleted ${file}`);
//     } catch (err) {
//       console.error(`Error deleting file ${file}:`, err);
//     }
//   });
// }
// server.listen(3001, () => {
//   console.log("Running on port 3001");
// });


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

const rooms = {}; // To keep track of active rooms and their connected clients

io.on("connection", (socket) => {
  console.log("connected");

  socket.on("joinRoom", ({ roomID }) => {
    if (!rooms[roomID]) {
      rooms[roomID] = {
        clients: [],
        processCode: null,
      };
    }
    rooms[roomID].clients.push(socket);
    socket.roomID = roomID;
    console.log(`User joined room: ${roomID}`);

    socket.on("code", (code) => {
      const language = code.lang;
      const type = code.type;
      const filename = code.file;
      let syntax = code.code;

      if (type === "run") {
        handleCodeExecution(language, syntax, filename, type, roomID);
      } else {
        io.to(roomID).emit("send", code);
      }
    });

    socket.on("input", (input) => {
      if (rooms[roomID].processCode && rooms[roomID].processCode.stdin) {
        rooms[roomID].processCode.stdin.write(`${input}\n`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected from room: ${roomID}`);
      rooms[roomID].clients = rooms[roomID].clients.filter(
        (client) => client !== socket
      );
      if (rooms[roomID].clients.length === 0) {
        if (rooms[roomID].processCode) {
          // Terminate the process
          if (process.platform === "win32") {
            rooms[roomID].processCode.stdin.end(); // Windows-specific termination
          } else {
            rooms[roomID].processCode.kill(); // Linux-specific termination
          }
          rooms[roomID].processCode = null;
        }
        delete rooms[roomID];
        console.log(`Room ${roomID} deleted because it's empty`);
      }
    });
  });
});

function handleCodeExecution(language, syntax, filename, type, roomID) {
  const lowerCaseLanguage = language.toLowerCase();

  switch (lowerCaseLanguage) {
    case "python":
      executePython(syntax, filename, type, language, roomID);
      break;
    case "java":
      executeJava(syntax, filename, type, language, roomID);
      break;
    case "c":
      executeC(syntax, filename, type, language, roomID);
      break;
    case "c++":
      executeCpp(syntax, filename, type, language);
      break;
    case "rust":
      executeRust(syntax, filename, type, language, roomID);
      break;
    default:
      io.to(roomID).emit("code", {
        lang: language,
        code: `Execution not supported for language: ${language}`,
        type: type,
        file: filename,
      });
      break;
  }
}

function executePython(syntax, filename, type, language, roomID) {
  rooms[roomID].processCode = spawn("python", ["-c", syntax]);
  handleProcessOutput(language, filename, type, roomID);
}

function executeJava(code, filename, type, language, roomID) {
  console.log(code);
  try {
    fs.writeFileSync(filename, code);
    const compileprocessCode = spawn("javac", [filename]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type, roomID);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        rooms[roomID].processCode = spawn("java", ["Main"]);
        handleProcessOutput(language, filename, type, roomID);
        cleanupFiles(["Main.java", "Main.class"]);
      } else {
        io.to(roomID).emit("code", {
          lang: language,
          code: "Java compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type, roomID);
  }
}

function executeC(code, filename, type, language, roomID) {
  const fileC = `${filename}.c`;
  const outputFileName = "a.out";

  try {
    fs.writeFileSync(fileC, code);
    const compileprocessCode = spawn("gcc", [fileC, "-o", outputFileName]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type, roomID);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        rooms[roomID].processCode = spawn(`./${outputFileName}`);
        handleProcessOutput(language, filename, type, roomID);
        cleanupFiles([fileC, outputFileName]);
      } else {
        io.to(roomID).emit("code", {
          lang: language,
          code: "C compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type, roomID);
  }
}

function executeCpp(code, filename, type, language, roomID) {
  const fileCpp = `${filename}.cpp`;
  const outputFile = "a.out";

  try {
    fs.writeFileSync(fileCpp, code);
    const compileprocessCode = spawn("g++", [fileCpp, "-o", outputFile]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type, roomID);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        rooms[roomID].processCode = spawn(`./${outputFile}`);
        handleProcessOutput(language, filename, type, roomID);
        cleanupFiles([fileCpp, outputFile]);
      } else {
        io.to(roomID).emit("code", {
          lang: language,
          code: "C++ compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type, roomID);
  }
}

function executeRust(code, filename, type, language, roomID) {
  const fileRust = `${filename}.rs`;
  const outputFileRust = `${filename}.out`;

  try {
    fs.writeFileSync(fileRust, code);
    const compileprocessCode = spawn("rustc", ["-o", outputFileRust, fileRust]);

    compileprocessCode.stderr.on("data", (data) => {
      handleError(data, language, filename, type, roomID);
    });

    compileprocessCode.on("close", (code) => {
      if (code === 0) {
        rooms[roomID].processCode = spawn(`./${outputFileRust}`);
        handleProcessOutput(language, filename, type, roomID);
        cleanupFiles([fileRust, outputFileRust]);
      } else {
        io.to(roomID).emit("code", {
          lang: language,
          code: "Rust compilation failed",
          type: type,
          file: filename,
        });
      }
    });
  } catch (err) {
    handleError(err, language, filename, type, roomID);
  }
}

function handleProcessOutput(language, filename, type, roomID) {
  const processCode = rooms[roomID].processCode;

  if (!processCode) return;

  processCode.stdout.setEncoding("utf-8");
  processCode.stderr.setEncoding("utf-8");

  processCode.stdout.on("data", (data) => {
    const output = data.toString();
    io.to(roomID).emit("code", {
      lang: language,
      code: `${output}`,
      type: "close",
      file: filename,
    });
  });

  processCode.stderr.on("data", (data) => {
    handleError(data, language, filename, type, roomID);
  });

  processCode.on("exit", (code) => {
    console.log(`About to exit with code: ${code}`);
    io.to(roomID).emit("code", {
      lang: language,
      code: "",
      type: "close",
      file: filename,
    });
    rooms[roomID].processCode = null;
  });

  processCode.on("close", (code) => {
    console.log(`${language} processCode exited with code ${code}`);
    rooms[roomID].processCode = null;
  });

  setTimeout(() => {
    if (rooms[roomID].processCode && !rooms[roomID].processCode.killed) {
      console.log("Entered in timeout");
      if (process.platform === "win32") {
        rooms[roomID].processCode.stdin.end(); // Windows-specific termination
      } else {
        rooms[roomID].processCode.kill(); // Linux-specific termination
      }
    }
  }, 100000);
}

function handleError(data, language, filename, type, roomID) {
  console.error("Error: " + data);
  const error = data.toString();
  io.to(roomID).emit("error", {
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
