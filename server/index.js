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
let process;

io.on("connection", (socket) => {
  console.log("connected");
  // establishing chatting between server and user
  socket.on("code", (code) => {
    const language = code.lang;
    const type = code.type;
    const filename = code.file;
    const syntax = code.code;
    if (type === "run") {
      switch (language) {
        case "python":
          process = spawn("python", ["-c", syntax]);
          process.stdout.on("data", (data) => {
            const output = data.toString();
            const outputLines = output.split(/[\n;]/);
            const lastLine = outputLines[outputLines.length - 2];
            if (
              lastLine &&
              lastLine.includes("Code is Successfully executed")
            ) {
              io.emit("code", {
                lang: language,
                code: `${output}\nCode is Finished`,
                type: type,
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
          process.stderr.on("data", (data) => {
            console.log("Error: " + data);
            const error = data.toString();
            io.emit("code", {
              lang: language,
              code: error,
              type: type,
              file: filename,
            });
          });

          process.on("close", (code) => {
            console.log(`Python process exited with code ${code}`);
          });
          break;
        case "java":
          const fileName = `${filename}.java`;
          try {
            // Write the received Java code to a file
            fs.writeFileSync(fileName, code);

            // Compile Java code
            const compileProcess = spawn("javac", [fileName]);

            compileProcess.stderr.on("data", (data) => {
              console.error("Compilation Error: " + data);
              const error = data.toString();
              io.emit("code", {
                lang: language,
                code: error,
                type: type,
                file: filename,
              });
            });

            compileProcess.on("close", (code) => {
              if (code === 0) {
                // If compilation is successful, run the Java program
                const className = "Main"; // Replace with your class name if different
                const process = spawn("java", [className]);

                process.stdout.on("data", (data) => {
                  const output = data.toString();
                  const outputLines = output.split(/[\n;]/);
                  const lastLine = outputLines[outputLines.length - 2];

                  if (
                    lastLine &&
                    lastLine.includes("Code is Successfully executed")
                  ) {
                    io.emit("code", {
                      lang,
                      code: `${output}\nCode is Finished`,
                      type: "run",
                      file: filename,
                    });
                  } else {
                    io.emit("code", {
                      lang,
                      code: output,
                      type: "run",
                      file: filename,
                    });
                  }
                });

                process.stderr.on("data", (data) => {
                  console.error("Runtime Error: " + data);
                  const error = data.toString();
                  io.emit("code", {
                    lang: language,
                    code: error,
                    type: type,
                    file: filename,
                  });
                });

                process.on("close", (code) => {
                  console.log(`Java process exited with code ${code}`);

                  // After execution, delete the temporary Java file
                  fs.unlinkSync(fileName);
                  console.log(`Deleted ${fileName}`);
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
        case "c":
          const fileC = `${filename}.c`;
          const outputFileName = "a.out";
          try {
            // Write the received Java code to a file
            fs.writeFileSync(fileC, code);

            // Compile Java code
            const compileProcess = spawn("gcc", [
              fileName,
              "-o",
              outputFileName,
            ]);

            compileProcess.stderr.on("data", (data) => {
              console.error("Compilation Error: " + data);
              const error = data.toString();
              io.emit("code", {
                lang: language,
                code: error,
                type: type,
                file: filename,
              });
            });

            compileProcess.on("close", (code) => {
              if (code === 0) {
                // If compilation is successful, run the Java program

                const process = spawn(`./${outputFileName}`);

                process.stdout.on("data", (data) => {
                  const output = data.toString();
                  const outputLines = output.split(/[\n;]/);
                  const lastLine = outputLines[outputLines.length - 2];

                  if (
                    lastLine &&
                    lastLine.includes("Code is Successfully executed")
                  ) {
                    io.emit("code", {
                      lang,
                      code: `${output}\nCode is Finished`,
                      type: "run",
                      file: filename,
                    });
                  } else {
                    io.emit("code", {
                      lang,
                      code: output,
                      type: "run",
                      file: filename,
                    });
                  }
                });

                process.stderr.on("data", (data) => {
                  console.error("Runtime Error: " + data);
                  const error = data.toString();
                  io.emit("code", {
                    lang: language,
                    code: error,
                    type: type,
                    file: filename,
                  });
                });

                process.on("close", (code) => {
                  console.log(`C process exited with code ${code}`);

                  fs.unlinkSync(fileC);
                  fs.unlinkSync(outputFileName);
                  console.log(`Deleted ${fileName} and ${outputFileName}`);
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
        case "c++":
          const fileCpp = `${filename}.cpp`;
          const outputFile = "a.out";
          try {
            // Write the received C++ code to a file
            fs.writeFileSync(fileCpp, code);

            // Compile C++ code
            const compileProcess = spawn("g++", [fileCpp, "-o", outputFile]);

            compileProcess.stderr.on("data", (data) => {
              console.error("Compilation Error: " + data);
              const error = data.toString();
              io.emit("code", {
                lang: language,
                code: error,
                type: type,
                file: filename,
              });
            });

            compileProcess.on("close", (code) => {
              if (code === 0) {
                // If compilation is successful, run the C++ program
                const process = spawn(`./${outputFile}`);

                process.stdout.on("data", (data) => {
                  const output = data.toString();
                  const outputLines = output.split(/[\n;]/);
                  const lastLine = outputLines[outputLines.length - 2];

                  if (
                    lastLine &&
                    lastLine.includes("Code is Successfully executed")
                  ) {
                    io.emit("code", {
                      lang,
                      code: `${output}\nCode is Finished`,
                      type: "run",
                      file: filename,
                    });
                  } else {
                    io.emit("code", {
                      lang,
                      code: output,
                      type: "run",
                      file: filename,
                    });
                  }
                });

                process.stderr.on("data", (data) => {
                  console.error("Runtime Error: " + data);
                  const error = data.toString();
                  io.emit("code", {
                    lang: language,
                    code: error,
                    type: type,
                    file: filename,
                  });
                });

                process.on("close", (code) => {
                  console.log(`C++ process exited with code ${code}`);

                  // After execution, delete the temporary C++ file and output binary
                  fs.unlinkSync(fileCpp);
                  fs.unlinkSync(outputFile);
                  console.log(`Deleted ${fileCpp} and ${outputFile}`);
                });
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
            console.error("Error writing C++ file:", err);
            io.emit("code", {
              lang: language,
              code: "Error writing C++ file",
              type: type,
              file: filename,
            });
          }

        case "rust":
          const fileRust = `${filename}.rs`;
          const outputFileRust = `${filename}.out`;

          try {
            // Write the received Rust code to a file
            fs.writeFileSync(fileRust, code);

            // Compile Rust code
            const compileProcess = spawn("rustc", [
              "-o",
              outputFileRust,
              fileRust,
            ]);

            compileProcess.stderr.on("data", (data) => {
              console.error("Compilation Error: " + data);
              const error = data.toString();
              io.emit("code", {
                lang: language,
                code: error,
                type: type,
                file: filename,
              });
            });

            compileProcess.on("close", (code) => {
              if (code === 0) {
                // If compilation is successful, run the Rust program
                const process = spawn(`./${outputFileRust}`);

                process.stdout.on("data", (data) => {
                  const output = data.toString();
                  const outputLines = output.split(/[\n;]/);
                  const lastLine = outputLines[outputLines.length - 2];

                  if (
                    lastLine &&
                    lastLine.includes("Code is Successfully executed")
                  ) {
                    io.emit("code", {
                      lang,
                      code: `${output}\nCode is Finished`,
                      type: "run",
                      file: filename,
                    });
                  } else {
                    io.emit("code", {
                      lang,
                      code: output,
                      type: "run",
                      file: filename,
                    });
                  }
                });

                process.stderr.on("data", (data) => {
                  console.error("Runtime Error: " + data);
                  const error = data.toString();
                  io.emit("code", {
                    lang: language,
                    code: error,
                    type: type,
                    file: filename,
                  });
                });

                process.on("close", (code) => {
                  console.log(`Rust process exited with code ${code}`);

                  // After execution, delete the temporary Rust file and output binary
                  fs.unlinkSync(fileRust);
                  fs.unlinkSync(outputFileRust);
                  console.log(`Deleted ${fileRust} and ${outputFileRust}`);
                });
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
            console.error("Error writing Rust file:", err);
            io.emit("code", {
              lang: language,
              code: "Error writing Rust file",
              type: type,
              file: filename,
            });
          }

          break;
        default:
          io.emit("code", {
            lang: language,
            code: `Execution not supported for language: ${lang}`,
            type: type,
            file: filename,
          });
          break;
      }
    } else {
      io.emit("code", code);
    }
  });
  socket.on("input", (input) => {
    if (process && process.stdin) {
      process.stdin.write(input + "\n");
    }
  });
  // to handle disconnection
  socket.on("disconnect", () => {
    if (process) {
      process.kill();
    }
  });
});
server.listen(3001, () => {
  console.log("Running on port 3001");
});
