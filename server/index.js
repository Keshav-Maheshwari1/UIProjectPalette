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
  // establishing chatting between server and user
  socket.on("code", (code) => {
    const language = code.lang.toLowerCase();
    const type = code.type;
    const filename = code.file;
    let syntax = code.code;
    if (type === "run") {
      const lowerCaseLanguage = language.toLowerCase();
      switch (language) {
        case "python":
          processCode = spawn("python", ["-c", syntax]);
          processCode.stdout.setEncoding("utf-8");
          processCode.stderr.setEncoding("utf-8");
          processCode.stdout.on("data", (data) => {
            const output = data.toString();
            const outputLines = output.split(/[\n;]/);
            const lastLine = outputLines[outputLines.length - 2];
            if (lastLine && lastLine.includes("Code Executed Successfully")) {
              io.emit("code", {
                lang: language,
                code: `${output}`,
                type: "close",
                file: filename,
              });
            } else {
              io.emit("code", {
                lang: language,
                code: output,
                type: type,
                file: filename,
              });
            }
            
          });
          // For error
          processCode.stderr.on("data", (data) => {
            console.log("Error: " + data);
            const error = data.toString();
            io.emit("code", {
              lang: language,
              code: error,
              type: type,
              file: filename,
            });
            clearInterval(checkProcessRunning); 
          });
          processCode.on("exit", (code) => {
            console.log(`About to exit with code: ${code}`);
            io.emit("code",{
              lang: language,
              code: "",
              type: "close",
              file: filename,
            })
            clearInterval(checkProcessRunning); // Stop checking on process exit
            processCode = null;
          });
          processCode.on("close", (code) => {
            
            console.log(`Python processCode exited with code ${code}`);
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
              clearInterval(checkProcessRunning); // Ensure interval is cleared
            }
          }, 1000);

          setTimeout(() => {
            if (processCode && !processCode.killed) {
              // processCode.kill("SIGINT"); // or processCode.kill() to use default signal
              console.log("Entered in timeout")
              processCode.stdin.end()
            }
          }, 100000);

          break;
        case "java":
          const fileName = `Main.java`;
          try {
            // Write the received Java code to a file
            console.log(code.code);
            fs.writeFileSync(fileName, code.code);

            // Compile Java code
            const compileprocessCode = spawn("javac", [fileName]);
            compileprocessCode.stderr.on("data", (data) => {
              console.error("Compilation Error: " + data);
              const error = data.toString();
              io.emit("code", {
                lang: language,
                code: error,
                type: type,
                file: filename,
              });
            });

            compileprocessCode.on("close", (code) => {
              if (code === 0) {
                // If compilation is successful, run the Java program
                const className = "Main"; // Replace with your class name if different
                const processCode = spawn("java", [className]);
                processCode.stdout.on("data", (data) => {
                  const output = data.toString();
                  const outputLines = output.split(/[\n;]/);
                  const lastLine = outputLines[outputLines.length - 2];

                  if (
                    lastLine &&
                    lastLine.includes("Code is Successfully executed")
                  ) {
                    io.emit("code", {
                      lang: language,
                      code: `${output}`,
                      type: "close",
                      file: filename,
                    });
                  } else {
                    console.log("Entered in else");
                    io.emit("code", {
                      lang: language,
                      code: `${output}`,
                      type: "run",
                      file: filename,
                    });
                  }
                });

                processCode.stderr.on("data", (data) => {
                  console.error("Runtime Error: " + data);
                  const error = data.toString();
                  io.emit("code", {
                    lang: language,
                    code: error,
                    type: type,
                    file: filename,
                  });
                });

                processCode.on("close", (code) => {
                  console.log(`Java processCode exited with code ${code}`);

                  // After execution, delete the temporary Java file
                  fs.unlinkSync(fileName);
                  fs.unlinkSync("Main.class");
                  console.log(`Deleted ${fileName}`);
                });
                // processCode.stdin.write(''); // Sending an empty input to trigger the prompt
                io.emit("inputPrompt", {
                  lang: language,
                  file: filename,
                });
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
            console.error("Error writing Java file:", err);
            io.emit("code", {
              lang: language,
              code: "Error writing Java file",
              type: type,
              file: filename,
            });
          }
          break;
      }
    } else {
      io.emit("code", code);
    }
  });

  // to handle disconnection
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
server.listen(3001, () => {
  console.log("Running on port 3001");
});
//         case "c":
// const fileC = `${filename}.c`;
// const outputFileName = "a.out";
// try {
//   // Write the received Java code to a file
//   fs.writeFileSync(fileC, code);

//   // Compile Java code
//   const compileprocessCode = spawn("gcc", [
//     fileName,
//     "-o",
//     outputFileName,
//   ]);

//   compileprocessCode.stderr.on("data", (data) => {
//     console.error("Compilation Error: " + data);
//     const error = data.toString();
//     io.emit("code", {
//       lang: language,
//       code: error,
//       type: type,
//       file: filename,
//     });
//   });

//   compileprocessCode.on("close", (code) => {
//     if (code === 0) {
//       // If compilation is successful, run the Java program

//       const processCode = spawn(`./${outputFileName}`);

//       processCode.stdout.on("data", (data) => {
//         const output = data.toString();
//         const outputLines = output.split(/[\n;]/);
//         const lastLine = outputLines[outputLines.length - 2];

//         if (
//           lastLine &&
//           lastLine.includes("Code is Successfully executed")
//         ) {
//           io.emit("code", {
//             lang,
//             code: `${output}`,
//             type: "run",
//             file: filename,
//           });
//         } else {
//           io.emit("code", {
//             lang,
//             code: output,
//             type: "run",
//             file: filename,
//           });
//         }
//       });

//       processCode.stderr.on("data", (data) => {
//         console.error("Runtime Error: " + data);
//         const error = data.toString();
//         io.emit("code", {
//           lang: language,
//           code: error,
//           type: type,
//           file: filename,
//         });
//       });

//       processCode.on("close", (code) => {
//         console.log(`C processCode exited with code ${code}`);

//         fs.unlinkSync(fileC);
//         fs.unlinkSync(outputFileName);
//         console.log(`Deleted ${fileName} and ${outputFileName}`);
//       });
//     } else {
//       io.emit("code", {
//         lang: language,
//         code: "Java compilation failed",
//         type: type,
//         file: filename,
//       });
//     }
//   });
// } catch (err) {
//   console.error("Error writing Java file:", err);
//   io.emit("code", {
//     lang: language,
//     code: "Error writing Java file",
//     type: type,

//     file: filename,
//   });
// }
// break;
// case "c++":
// const fileCpp = `${filename}.cpp`;
// const outputFile = "a.out";
// try {
//   // Write the received C++ code to a file
//   fs.writeFileSync(fileCpp, code);

//   // Compile C++ code
//   const compileprocessCode = spawn("g++", [fileCpp, "-o", outputFile]);

//   compileprocessCode.stderr.on("data", (data) => {
//     console.error("Compilation Error: " + data);
//     const error = data.toString();
//     io.emit("code", {
//       lang: language,
//       code: error,
//       type: type,
//       file: filename,
//     });
//   });

//   compileprocessCode.on("close", (code) => {
//     if (code === 0) {
//       // If compilation is successful, run the C++ program
//       const processCode = spawn(`./${outputFile}`);

//       processCode.stdout.on("data", (data) => {
//         const output = data.toString();
//         const outputLines = output.split(/[\n;]/);
//         const lastLine = outputLines[outputLines.length - 2];

//         if (
//           lastLine &&
//           lastLine.includes("Code is Successfully executed")
//         ) {
//           io.emit("code", {
//             lang,
//             code: `${output}`,
//             type: "run",
//             file: filename,
//           });
//         } else {
//           io.emit("code", {
//             lang,
//             code: output,
//             type: "run",
//             file: filename,
//           });
//         }
//       });

//       processCode.stderr.on("data", (data) => {
//         console.error("Runtime Error: " + data);
//         const error = data.toString();
//         io.emit("code", {
//           lang: language,
//           code: error,
//           type: type,
//           file: filename,
//         });
//       });

//       processCode.on("close", (code) => {
//         console.log(`C++ processCode exited with code ${code}`);

//         // After execution, delete the temporary C++ file and output binary
//         fs.unlinkSync(fileCpp);
//         fs.unlinkSync(outputFile);
//         console.log(`Deleted ${fileCpp} and ${outputFile}`);
//       });
//     } else {
//       io.emit("code", {
//         lang: language,
//         code: "C++ compilation failed",
//         type: type,
//         file: filename,
//       });
//     }
//   });
// } catch (err) {
//   console.error("Error writing C++ file:", err);
//   io.emit("code", {
//     lang: language,
//     code: "Error writing C++ file",
//     type: type,
//     file: filename,
//   });
// }

// case "rust":
// const fileRust = `${filename}.rs`;
// const outputFileRust = `${filename}.out`;

// try {
//   // Write the received Rust code to a file
//   fs.writeFileSync(fileRust, code);

//   // Compile Rust code
//   const compileprocessCode = spawn("rustc", [
//     "-o",
//     outputFileRust,
//     fileRust,
//   ]);

//   compileprocessCode.stderr.on("data", (data) => {
//     console.error("Compilation Error: " + data);
//     const error = data.toString();
//     io.emit("code", {
//       lang: language,
//       code: error,
//       type: type,
//       file: filename,
//     });
//   });

//   compileprocessCode.on("close", (code) => {
//     if (code === 0) {
//       // If compilation is successful, run the Rust program
//       const processCode = spawn(`./${outputFileRust}`);

//       processCode.stdout.on("data", (data) => {
//         const output = data.toString();
//         const outputLines = output.split(/[\n;]/);
//         const lastLine = outputLines[outputLines.length - 2];

//         if (
//           lastLine &&
//           lastLine.includes("Code is Successfully executed")
//         ) {
//           io.emit("code", {
//             lang,
//             code: `${output}`,
//             type: "run",
//             file: filename,
//           });
//         } else {
//           io.emit("code", {
//             lang,
//             code: output,
//             type: "run",
//             file: filename,
//           });
//         }
//       });

//       processCode.stderr.on("data", (data) => {
//         console.error("Runtime Error: " + data);
//         const error = data.toString();
//         io.emit("code", {
//           lang: language,
//           code: error,
//           type: type,
//           file: filename,
//         });
//       });

//       processCode.on("close", (code) => {
//         console.log(`Rust processCode exited with code ${code}`);

//         // After execution, delete the temporary Rust file and output binary
//         fs.unlinkSync(fileRust);
//         fs.unlinkSync(outputFileRust);
//         console.log(`Deleted ${fileRust} and ${outputFileRust}`);
//       });
//     } else {
//       io.emit("code", {
//         lang: language,
//         code: "Rust compilation failed",
//         type: type,
//         file: filename,
//       });
//     }
//   });
// } catch (err) {
//   console.error("Error writing Rust file:", err);
//   io.emit("code", {
//     lang: language,
//     code: "Error writing Rust file",
//     type: type,
//     file: filename,
//   });
// }

// break;
// default:
// io.emit("code", {
//   lang: language,
//   code: `Execution not supported for language: ${language}`,
//   type: type,
//   file: filename,
// });
// break;
